export function formatProbability(probability: number | null) {
  if (probability === null) {
    return "Unavailable";
  }

  return `${(probability * 100).toFixed(2)}%`;
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Unavailable";
  }

  return new Date(value).toLocaleString();
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function getVerdictClass(verdict: string | null) {
  if (verdict === "MALICIOUS") {
    return "border-red-500/20 bg-red-500/10 text-red-200";
  }

  if (verdict === "BENIGN") {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-200";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-200";
}

export function getStatusClass(status: string) {
  if (status === "COMPLETED") {
    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-200";
  }

  if (status === "FAILED") {
    return "border-red-500/20 bg-red-500/10 text-red-200";
  }

  return "border-slate-700 bg-slate-900/80 text-slate-300";
}

export function getProbabilityBarClass(verdict: string | null) {
  if (verdict === "MALICIOUS") {
    return "bg-gradient-to-r from-orange-400 via-red-400 to-red-500";
  }

  if (verdict === "BENIGN") {
    return "bg-gradient-to-r from-emerald-400 to-cyan-400";
  }

  return "bg-gradient-to-r from-amber-300 to-amber-500";
}
