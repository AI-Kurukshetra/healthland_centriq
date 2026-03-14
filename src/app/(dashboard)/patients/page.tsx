import Link from "next/link";
import { listBedBoard, listPatients } from "@/lib/phase1/service";
import { createClient } from "@/utils/supabase/server";

export default async function PatientsPage() {
  const supabase = await createClient();
  const [patients, bedBoard] = await Promise.all([
    listPatients(supabase),
    listBedBoard(supabase),
  ]);

  const assignedPatientIds = new Set(
    bedBoard
      .map((bed) => bed.patient?.id)
      .filter((patientId): patientId is string => Boolean(patientId)),
  );

  return (
    <main className="grid gap-6">
      <section className="surface-card p-5">
        <div className="section-header">
          <div>
            <p className="chip w-fit">Patient Management</p>
            <h2 className="page-title mt-2">Patient Directory</h2>
            <p className="page-subtitle">Review registered patients and current admission status.</p>
          </div>
          <Link href="/registration" className="btn-primary text-sm">
            Register New Patient
          </Link>
        </div>
      </section>

      <section className="surface-card p-5">
        <div className="section-header">
          <h3 className="text-lg font-semibold">All Patients</h3>
          <p className="chip">{patients.length} total</p>
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                <th className="p-2">MRN</th>
                <th className="p-2">Name</th>
                <th className="p-2">DOB</th>
                <th className="p-2">Admission</th>
                <th className="p-2">Registered At</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-[var(--border)]">
                  <td className="p-2 font-mono">{patient.mrn}</td>
                  <td className="p-2">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="font-medium text-[var(--secondary)] hover:underline"
                    >
                      {patient.first_name} {patient.last_name}
                    </Link>
                  </td>
                  <td className="p-2">{patient.dob}</td>
                  <td className="p-2">
                    <span className="chip">
                      {assignedPatientIds.has(patient.id) ? "Assigned bed" : "Waiting"}
                    </span>
                  </td>
                  <td className="p-2">{new Date(patient.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {patients.length === 0 ? (
                <tr>
                  <td className="p-3 text-[var(--text-muted)]" colSpan={5}>
                    No patients registered yet.
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
