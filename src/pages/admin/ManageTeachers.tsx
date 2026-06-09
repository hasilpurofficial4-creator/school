import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { apiFetch } from "../../utils/api";
import type { Teacher } from "../../types";
import Modal from "../../components/Modal";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ManageTeachers() {
  const { data: teachers, loading, error, refetch } = useApi<Teacher[]>("/api/teachers");
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ name: "", email: "", subject: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openAdd = () => {
    setEditingTeacher(null);
    setForm({ name: "", email: "", subject: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setForm({ name: teacher.name, email: teacher.email, subject: teacher.subject });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    const method = editingTeacher ? "PUT" : "POST";
    const body = editingTeacher ? { id: editingTeacher.id, ...form } : form;

    const result = await apiFetch("/api/teachers", {
      method,
      body: JSON.stringify(body),
    });

    if (result.success) {
      setShowModal(false);
      refetch();
    } else {
      setFormError(result.error || "Failed to save teacher");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    const result = await apiFetch("/api/teachers", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (result.success) refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Teachers</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          + Add Teacher
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {teachers && teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-900">{teacher.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{teacher.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{teacher.subject || "-"}</td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button onClick={() => openEdit(teacher)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(teacher.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No teachers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTeacher ? "Edit Teacher" : "Add Teacher"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
          </div>
          {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{formError}</div>}
          <button type="submit" disabled={submitting} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg transition-colors">
            {submitting ? "Saving..." : editingTeacher ? "Update Teacher" : "Add Teacher"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
