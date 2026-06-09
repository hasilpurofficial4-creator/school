import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../utils/api";
import type { BannedUser, UserRole } from "../../types";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ManageBans() {
  const { data: bannedUsers, loading, error, refetch } = useApi<BannedUser[]>("/api/banned");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", role: "student" as UserRole, reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const result = await apiFetch("/api/banned", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (result.success) {
      setShowModal(false);
      setForm({ email: "", role: "student", reason: "" });
      refetch();
    } else {
      setFormError(result.error || "Failed to ban user");
    }
    setSubmitting(false);
  };

  const handleUnban = async (email: string) => {
    if (!confirm(`Unban ${email}?`)) return;
    const result = await apiFetch("/api/banned", {
      method: "DELETE",
      body: JSON.stringify({ email }),
    });
    if (result.success) refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Bans</h1>
        <button
          onClick={() => { setFormError(""); setShowModal(true); }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          + Ban User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Banned At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bannedUsers && bannedUsers.length > 0 ? (
                bannedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs capitalize">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.reason}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(user.bannedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button onClick={() => handleUnban(user.email)} className="text-emerald-600 hover:text-emerald-800">Unban</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No banned users</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Ban User">
        <form onSubmit={handleBan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="user@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
            <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none" placeholder="Reason for banning..." />
          </div>
          {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{formError}</div>}
          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors">
            {submitting ? "Banning..." : "Ban User"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
