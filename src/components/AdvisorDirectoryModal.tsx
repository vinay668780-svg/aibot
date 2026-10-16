import { useState } from 'react';
import { X, Building2, Phone, Mail, Clock, Calendar, CheckCircle2, UserCheck } from 'lucide-react';
import { DEPARTMENT_DIRECTORY } from '../data/knowledgeBase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectDepartmentForQuery: (deptName: string) => void;
}

export function AdvisorDirectoryModal({ isOpen, onClose, onSelectDepartmentForQuery }: Props) {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const [studentId, setStudentId] = useState('MSU-2024-8849');
  const [preferredDate, setPreferredDate] = useState('2026-10-21');
  const [reason, setReason] = useState('Course Prerequisite Override & Degree Audit');

  if (!isOpen) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setAppointmentBooked(true);
    setTimeout(() => {
      // Keep state showing appointment reference
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-900 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Academic & Administrative Directory
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Official registrar, career placement, and dean advising desks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directory Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {appointmentBooked ? (
            <div className="p-6 text-center space-y-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100">
                  Advising Consultation Confirmed
                </h3>
                <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                  Appointment reference <strong>#ADV-2026-9812</strong> has been lodged for Student ID <strong>{studentId}</strong> on <strong>{preferredDate}</strong>.
                </p>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                Please bring your current unofficial transcript and prerequisite waiver petitions to Administration Hall Room 101.
              </div>
              <button
                type="button"
                onClick={() => setAppointmentBooked(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : selectedDeptId ? (
            <form onSubmit={handleBook} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Schedule In-Person Advising Appointment
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedDeptId(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline cursor-pointer"
                >
                  ← Back to Directory
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Student Matriculation ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Preferred Consultation Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Reason for Consultation / Academic Dossier Review
                </label>
                <textarea
                  rows={2}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDeptId(null)}
                  className="px-3 py-2 text-xs font-medium rounded-lg text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {DEPARTMENT_DIRECTORY.map(dept => (
                <div
                  key={dept.id}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors space-y-2.5 shadow-xs"
                >
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {dept.department}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                      {dept.officer} • {dept.title}
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{dept.room}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <a href={`tel:${dept.phone}`} className="hover:underline text-indigo-600 dark:text-indigo-400">{dept.phone}</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <a href={`mailto:${dept.email}`} className="hover:underline">{dept.email}</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <span>{dept.officeHours}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onSelectDepartmentForQuery(`I need help from ${dept.department} regarding: `)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-[11px] cursor-pointer"
                    >
                      Ask Helpdesk
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDeptId(dept.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
                    >
                      Book In-Person
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Advisors available for walk-in consultations during regular office hours.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-600 dark:text-zinc-300 font-medium hover:underline cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
