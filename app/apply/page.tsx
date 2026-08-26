import { redirect } from "next/navigation";

// The bare /apply entry defaults to the income certificate — the config-driven
// flow lives at /apply/[slug].
export default function ApplyIndex() {
  redirect("/apply/income-certificate");
}
