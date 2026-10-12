import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { deleteUserAccount as deleteUserAccountFn } from "@/helpers/userAdminHelper";

interface ManagedUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isAdmin: boolean;
  profileId?: string;
  createdAt: Date;
  phone?: string;
}

interface EditFormState {
  name: string;
  email: string;
  phone: string;
  role: string;
  isVerified: boolean;
  isAdmin: boolean;
}

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleTab, setRoleTab] = useState("all");
  const [statusTab, setStatusTab] = useState("all");

  const [editUser, setEditUser] = useState<ManagedUser | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteUser, setDeleteUser] = useState<ManagedUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      let snapshot;
      try {
        snapshot = await getDocs(query(usersRef, orderBy("createdAt", "desc")));
      } catch {
        snapshot = await getDocs(usersRef);
      }

      const list: ManagedUser[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          uid: data.uid || docSnap.id,
          name: data.name || "Unnamed User",
          email: data.email || "N/A",
          role: (data.role || "unknown").toLowerCase(),
          isVerified: data.isVerified === true,
          isAdmin: data.isAdmin === true,
          profileId: data.profileId || undefined,
          createdAt: data.createdAt?.toDate?.() || new Date(0),
          phone: data.phone || data.phoneNumber || undefined,
        });
      });

      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setUsers(list);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const counts = useMemo(() => {
    return {
      total: users.length,
      doctors: users.filter((u) => u.role === "doctor").length,
      hospitals: users.filter((u) => u.role === "hospital").length,
      verified: users.filter((u) => u.isVerified).length,
    };
  }, [users]);

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.role.includes(q) ||
      (user.phone || "").toLowerCase().includes(q) ||
      (user.profileId || "").toLowerCase().includes(q);

    const matchesRole =
      roleTab === "all" ||
      (roleTab === "doctors" && user.role === "doctor") ||
      (roleTab === "hospitals" && user.role === "hospital") ||
      (roleTab === "admins" && user.isAdmin);

    const matchesStatus =
      statusTab === "all" ||
      (statusTab === "verified" && user.isVerified) ||
      (statusTab === "pending" && !user.isVerified) ||
      (statusTab === "incomplete" && !user.profileId);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (date: Date) => {
    if (!date.getTime()) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const openProfile = (user: ManagedUser) => {
    if (!user.profileId) {
      toast.info("This user has not completed onboarding yet");
      return;
    }
    navigate(
      user.role === "hospital"
        ? `/admin/hospital/${user.profileId}`
        : `/admin/doctor/${user.profileId}`
    );
  };

  const openEdit = (user: ManagedUser) => {
    setEditUser(user);
    setEditForm({
      name: user.name === "Unnamed User" ? "" : user.name,
      email: user.email === "N/A" ? "" : user.email,
      phone: user.phone || "",
      role: user.role === "unknown" ? "doctor" : user.role,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    });
  };

  const handleSaveEdit = async () => {
    if (!editUser || !editForm) return;

    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!editForm.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsSaving(true);
    try {
      const userRef = doc(db, "users", editUser.id);
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim() || null,
        phoneNumber: editForm.phone.trim() || null,
        role: editForm.role,
        isVerified: editForm.isVerified,
        isAdmin: editForm.isAdmin,
      };

      await updateDoc(userRef, payload);

      // Keep linked profile name/email in sync when possible
      if (editUser.profileId) {
        const collectionName = editUser.profileId.startsWith("doctor")
          ? "doctors"
          : editUser.profileId.startsWith("hospital")
          ? "hospitals"
          : editForm.role === "hospital"
          ? "hospitals"
          : "doctors";

        try {
          await updateDoc(doc(db, collectionName, editUser.profileId), {
            name: editForm.name.trim(),
            email: editForm.email.trim(),
            isVerified: editForm.isVerified,
            ...(editForm.phone.trim()
              ? collectionName === "doctors"
                ? { phoneNumber: editForm.phone.trim() }
                : { contactNumber: editForm.phone.trim() }
              : {}),
          });
        } catch (profileError) {
          console.warn("Profile sync skipped:", profileError);
        }
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editUser.id
            ? {
                ...u,
                name: editForm.name.trim(),
                email: editForm.email.trim(),
                phone: editForm.phone.trim() || undefined,
                role: editForm.role,
                isVerified: editForm.isVerified,
                isAdmin: editForm.isAdmin,
              }
            : u
        )
      );

      toast.success("User details updated");
      setEditUser(null);
      setEditForm(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteUser) return;

    const currentUid = auth.currentUser?.uid;
    if (currentUid && (deleteUser.uid === currentUid || deleteUser.id === currentUid)) {
      toast.error("You cannot delete your own admin account");
      setDeleteUser(null);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserAccountFn({
        userId: deleteUser.uid || deleteUser.id,
        profileId: deleteUser.profileId,
        role: deleteUser.role,
      });

      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      toast.success("User and login account deleted successfully");
      setDeleteUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user completely");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 rounded-lg bg-slate-200/70" />
        <div className="h-72 rounded-lg bg-slate-200/70" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-slate-500 border-b border-slate-100 pb-3">
        <span>
          Total <span className="font-semibold text-slate-900 tabular-nums">{counts.total}</span>
        </span>
        <span>
          Doctors <span className="font-semibold text-slate-900 tabular-nums">{counts.doctors}</span>
        </span>
        <span>
          Hospitals <span className="font-semibold text-slate-900 tabular-nums">{counts.hospitals}</span>
        </span>
        <span>
          Verified <span className="font-semibold text-emerald-600 tabular-nums">{counts.verified}</span>
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-9 text-sm border-slate-200 bg-slate-50/60"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "All" },
              { id: "doctors", label: "Doctors" },
              { id: "hospitals", label: "Hospitals" },
              { id: "admins", label: "Admins" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleTab(tab.id)}
                className={`h-8 rounded-md px-3 text-xs transition-colors ${
                  roleTab === tab.id
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span className="mx-0.5 hidden h-8 w-px bg-slate-200 sm:block" />
            {[
              { id: "all", label: "Any status" },
              { id: "verified", label: "Verified" },
              { id: "pending", label: "Pending" },
              { id: "incomplete", label: "Incomplete" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusTab(tab.id)}
                className={`h-8 rounded-md px-3 text-xs transition-colors ${
                  statusTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
      </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-2 py-2.5 font-medium sm:px-3">User</th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Role</th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Status</th>
                <th className="px-2 py-2.5 font-medium sm:px-3">Joined</th>
                <th className="px-2 py-2.5 font-medium text-right sm:px-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-slate-900 truncate">
                        {user.name}
                        {user.isAdmin && (
                          <span className="ml-2 text-[10px] font-medium text-blue-600">ADMIN</span>
                        )}
                      </p>
                      <p className="text-[12px] text-slate-500 truncate">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <span className="text-[12px] capitalize text-slate-600">{user.role}</span>
                  </td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <span
                      className={`text-[12px] font-medium ${
                        !user.profileId
                          ? "text-slate-500"
                          : user.isVerified
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {!user.profileId ? "Incomplete" : user.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-[12px] text-slate-500 sm:px-3">{formatDate(user.createdAt)}</td>
                  <td className="px-2 py-2.5 sm:px-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={!user.profileId}
                        className="h-8 px-2 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-40"
                        onClick={() => openProfile(user)}
                        title="View profile"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openEdit(user)}
                        title="Edit user"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteUser(user)}
                        title="Delete user"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="py-12 text-center text-sm text-slate-400">No users match your filters</p>
          )}
        </div>

        <div className="border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
          Showing {filteredUsers.length} of {users.length}
        </div>

      {/* Edit dialog */}
      <Dialog
        open={!!editUser}
        onOpenChange={(open) => {
          if (!open) {
            setEditUser(null);
            setEditForm(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit User Details</DialogTitle>
            <DialogDescription className="text-sm">
              Update account information for this user.
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4 py-1">
              <div className="space-y-1.5">
                <Label htmlFor="edit-name" className="text-sm">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-email" className="text-sm">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-phone" className="text-sm">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="h-10 text-sm"
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm">Role</Label>
                <Select
                  value={editForm.role}
                  onValueChange={(value) => setEditForm({ ...editForm, role: value })}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="hospital">Hospital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-900">Verified</p>
                  <p className="text-xs text-slate-500">Mark this account as verified</p>
                </div>
                <Switch
                  checked={editForm.isVerified}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isVerified: checked })}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-slate-900">Admin Access</p>
                  <p className="text-xs text-slate-500">Allow admin panel access</p>
                </div>
                <Switch
                  checked={editForm.isAdmin}
                  onCheckedChange={(checked) => setEditForm({ ...editForm, isAdmin: checked })}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setEditUser(null);
                setEditForm(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteUser}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-slate-700">{deleteUser?.name}</span>
              {deleteUser?.email ? ` (${deleteUser.email})` : ""} from the platform
              {deleteUser?.profileId ? ", their linked profile," : ""} and their Firebase login
              (so the email can be used again). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
