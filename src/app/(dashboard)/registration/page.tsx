import Link from "next/link";
import { assignBedAction } from "@/actions/bed-management";
import { PatientIntakeForm } from "@/components/registration/patient-intake-form";
import {
  listBedBoard,
  listPatients,
  listUnassignedPatients,
} from "@/lib/phase1/service";
import { createClient } from "@/utils/supabase/server";

export default async function RegistrationPage() {
  const supabase = await createClient();
  const [patients, bedBoard, unassignedPatients] = await Promise.all([
    listPatients(supabase),
    listBedBoard(supabase),
    listUnassignedPatients(supabase),
  ]);
  const totalBeds = bedBoard.length;
  const occupiedBeds = bedBoard.filter((bed) => bed.status === "occupied").length;
  const availableBeds = bedBoard.filter(
    (bed) => bed.status === "available" || bed.status === "reserved",
  );
  const activePatientIds = new Set(
    bedBoard
      .map((bed) => bed.patient?.id)
      .filter((patientId): patientId is string => Boolean(patientId)),
  );

  return (
    <main className="grid gap-6">
      <header className="section-header surface-card p-5">
        <div>
          <p className="chip w-fit">Operations Dashboard</p>
          <h1 className="page-title mt-2">Registration and Bed Flow</h1>
          <p className="page-subtitle">
            Register patients, track capacity, and assign beds from one screen.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/patients" className="btn-ghost text-sm">
            Manage Patients
          </Link>
          <Link href="/beds" className="btn-ghost text-sm">
            Open Full Bed Board
          </Link>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="metric-card">
          <p className="metric-label">Registered Patients</p>
          <p className="metric-value">{patients.length}</p>
          <p className="metric-note">Total in organization</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Bed Occupancy</p>
          <p className="metric-value">
            {occupiedBeds}/{totalBeds}
          </p>
          <p className="metric-note">
            {totalBeds === 0
              ? "No beds configured"
              : `${Math.round((occupiedBeds / totalBeds) * 100)}% occupied`}
          </p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Ready to Assign</p>
          <p className="metric-value">{availableBeds.length}</p>
          <p className="metric-note">Available or reserved beds</p>
        </article>
        <article className="metric-card">
          <p className="metric-label">Waiting for Bed</p>
          <p className="metric-value">{unassignedPatients.length}</p>
          <p className="metric-note">Unassigned registered patients</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <PatientIntakeForm />
        <div className="grid gap-6">
          <section className="surface-card p-5">
            <div className="section-header">
              <h2 className="text-lg font-semibold">Quick Bed Assignment</h2>
              <p className="chip">{availableBeds.length} beds ready</p>
            </div>
            <form action={assignBedAction} className="mt-3 grid gap-3">
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Unassigned patient</span>
                <select
                  name="patientId"
                  required
                  className="app-input"
                  disabled={unassignedPatients.length === 0}
                >
                  <option value="">Select patient</option>
                  {unassignedPatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.mrn} - {patient.first_name} {patient.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-sm font-medium">Target bed</span>
                <select
                  name="bedId"
                  required
                  className="app-input"
                  disabled={availableBeds.length === 0}
                >
                  <option value="">Select bed</option>
                  {availableBeds.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.unit} {bed.room}-{bed.bed_label} ({bed.status})
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="btn-primary w-fit"
                disabled={unassignedPatients.length === 0 || availableBeds.length === 0}
              >
                Assign Now
              </button>
            </form>
          </section>

          <section className="surface-card p-5">
            <div className="section-header">
              <h2 className="text-lg font-semibold">Waiting Queue</h2>
              <p className="chip">{unassignedPatients.length} patients</p>
            </div>
            <ul className="mt-3 grid gap-2">
              {unassignedPatients.slice(0, 8).map((patient) => (
                <li
                  key={patient.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm"
                >
                  <p className="font-semibold">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">MRN {patient.mrn}</p>
                </li>
              ))}
              {unassignedPatients.length === 0 ? (
                <li className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-4 text-sm text-[var(--text-muted)]">
                  No patients waiting for assignment.
                </li>
              ) : null}
            </ul>
          </section>
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="section-header">
          <h2 className="text-lg font-semibold">Recent Registrations</h2>
          <p className="chip">{patients.length} total</p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                <th className="p-2">MRN</th>
                <th className="p-2">Name</th>
                <th className="p-2">DOB</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-[var(--border)]">
                  <td className="p-2 font-mono">{patient.mrn}</td>
                  <td className="p-2">
                    <Link href={`/patients/${patient.id}`} className="font-medium text-[var(--secondary)] hover:underline">
                      {patient.first_name} {patient.last_name}
                    </Link>
                  </td>
                  <td className="p-2">{patient.dob}</td>
                  <td className="p-2">
                    <span className="chip">
                      {activePatientIds.has(patient.id) ? "Assigned" : "Unassigned"}
                    </span>
                  </td>
                  <td className="p-2">{new Date(patient.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {patients.length === 0 ? (
                <tr>
                  <td className="p-3 text-[var(--text-muted)]" colSpan={5}>
                    No patients yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
