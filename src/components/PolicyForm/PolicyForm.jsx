import { useState } from "react";
import { motion } from "framer-motion";
import { HiCheck, HiClock } from "react-icons/hi2";
import GlassCard from "../ui/GlassCard";
import { STATUS } from "../../constants/policyConstants";
import {
  PLAN_CATEGORIES,
  getPlanOptionsForCategory,
  resolvePlanSelection,
} from "../../data/planCatalog";

const basePlan = resolvePlanSelection(undefined);

const empty = {
  fullName: "",
  phone: "",
  planCategory: basePlan.planCategory,
  policyType: basePlan.policyType,
  policyPremium: "",
  status: STATUS.PENDING,
  nextFollowUpDate: "",
  notes: "",
};

/* Shared field styles — light + dark */
const inputClass =
  "peer w-full rounded-2xl border border-slate-200 bg-white px-4 pb-2.5 pt-6 text-base text-slate-900 placeholder-transparent transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/25 dark:border-white/20 dark:bg-white/5 dark:text-white dark:focus:border-teal-400/80 dark:focus:ring-teal-500/30";

const labelFloat =
  "pointer-events-none absolute left-4 top-2 text-xs font-medium text-teal-700 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-teal-800 dark:text-teal-200/90 dark:peer-placeholder-shown:text-slate-500 dark:peer-focus:text-teal-200";

/**
 * Add / edit form with floating labels + status toggle (large tap targets).
 */
export default function PolicyForm({
  initialValues = {},
  submitLabel = "Save",
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState(() => {
    const merged = {
      ...empty,
      ...initialValues,
      policyPremium:
        initialValues.policyPremium !== undefined &&
        initialValues.policyPremium !== ""
          ? String(initialValues.policyPremium)
          : initialValues.policyAmount !== undefined &&
              initialValues.policyAmount !== ""
            ? String(initialValues.policyAmount)
            : "",
    };
    const { planCategory, policyType } = resolvePlanSelection(
      merged.policyType,
    );
    return {
      ...merged,
      planCategory,
      policyType,
    };
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "planCategory") {
      const nextPlans = getPlanOptionsForCategory(value, "");
      setForm((f) => ({
        ...f,
        planCategory: value,
        policyType: nextPlans[0] ?? "",
      }));
      return;
    }
    setForm((f) => ({ ...f, [name]: value }));
  }

  function setStatus(next) {
    setForm((f) => ({ ...f, status: next }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.fullName.trim()) {
      setError("Please enter the client’s name.");
      return;
    }
    if (!form.phone.trim()) {
      setError("Please enter a phone number.");
      return;
    }
    if (!form.nextFollowUpDate) {
      setError("Please choose a follow-up date.");
      return;
    }
    const premium = Number(form.policyPremium);
    if (form.policyPremium !== "" && (Number.isNaN(premium) || premium < 0)) {
      setError("Policy premium should be a valid number.");
      return;
    }
    onSubmit({
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      policyType: form.policyType,
      policyPremium: form.policyPremium === "" ? 0 : premium,
      status: form.status,
      nextFollowUpDate: form.nextFollowUpDate,
      notes: form.notes.trim(),
    });
  }

  return (
    <GlassCard className="mx-auto max-w-lg p-6 sm:p-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {error ? (
          <p
            className="rounded-xl border border-rose-300/80 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900 dark:border-rose-400/40 dark:bg-rose-500/15 dark:text-rose-100"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="relative">
          <input
            id="fullName"
            name="fullName"
            autoComplete="name"
            placeholder=" "
            value={form.fullName}
            onChange={handleChange}
            className={inputClass}
          />
          <label htmlFor="fullName" className={labelFloat}>
            Full name
          </label>
        </div>

        <div className="relative">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder=" "
            value={form.phone}
            onChange={handleChange}
            className={inputClass}
          />
          <label htmlFor="phone" className={labelFloat}>
            Phone number
          </label>
        </div>

        <div className="relative">
          <select
            id="planCategory"
            name="planCategory"
            value={form.planCategory}
            onChange={handleChange}
            className={`${inputClass} appearance-none py-4 pt-6`}
          >
            {PLAN_CATEGORIES.map((cat) => (
              <option
                key={cat}
                value={cat}
                className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
              >
                {cat}
              </option>
            ))}
          </select>
          <label
            htmlFor="planCategory"
            className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-teal-700 dark:text-teal-200/90"
          >
            Plan category
          </label>
        </div>

        <div className="relative">
          <select
            id="policyType"
            name="policyType"
            value={form.policyType}
            onChange={handleChange}
            className={`${inputClass} appearance-none py-4 pt-6`}
          >
            {getPlanOptionsForCategory(form.planCategory, form.policyType).map(
              (t) => (
                <option
                  key={t}
                  value={t}
                  className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                >
                  {t}
                </option>
              ),
            )}
          </select>
          <label
            htmlFor="policyType"
            className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-teal-700 dark:text-teal-200/90"
          >
            Plan
          </label>
        </div>

        <div className="relative">
          <input
            id="policyPremium"
            name="policyPremium"
            type="number"
            min="0"
            step="1000"
            placeholder=" "
            value={form.policyPremium}
            onChange={handleChange}
            className={inputClass}
          />
          <label htmlFor="policyPremium" className={labelFloat}>
            Policy premium (₹)
          </label>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Policy status
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStatus(STATUS.PENDING)}
              className={`flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition-all ${
                form.status === STATUS.PENDING
                  ? "border-rose-400/60 bg-rose-500/20 text-rose-900 shadow-lg ring-2 ring-rose-400/40 dark:bg-rose-500/25 dark:text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
              }`}
            >
              <HiClock className="h-5 w-5" aria-hidden />
              Pending
            </button>
            <button
              type="button"
              onClick={() => setStatus(STATUS.COMPLETED)}
              className={`flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl border text-sm font-bold transition-all ${
                form.status === STATUS.COMPLETED
                  ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-900 shadow-lg ring-2 ring-emerald-400/40 dark:bg-emerald-500/25 dark:text-white"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
              }`}
            >
              <HiCheck className="h-5 w-5" aria-hidden />
              Completed
            </button>
          </div>
        </div>

        <div className="relative">
          <input
            id="nextFollowUpDate"
            name="nextFollowUpDate"
            type="date"
            placeholder=" "
            value={form.nextFollowUpDate}
            onChange={handleChange}
            className={`${inputClass} [color-scheme:light] dark:[color-scheme:dark]`}
          />
          <label
            htmlFor="nextFollowUpDate"
            className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-teal-700 dark:text-teal-200/90"
          >
            Follow-up date
          </label>
        </div>

        <div className="relative">
          <textarea
            id="notes"
            name="notes"
            rows={3}
            placeholder=" "
            value={form.notes}
            onChange={handleChange}
            className={`${inputClass} resize-y`}
          />
          <label htmlFor="notes" className={labelFloat}>
            Notes
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[52px] flex-1 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              Cancel
            </button>
          ) : null}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className="min-h-[52px] min-w-[160px] flex-1 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 text-sm font-bold text-slate-950 shadow-lg shadow-teal-500/25"
          >
            {submitLabel}
          </motion.button>
        </div>
      </form>
    </GlassCard>
  );
}
