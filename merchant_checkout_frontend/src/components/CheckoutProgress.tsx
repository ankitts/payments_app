export type CheckoutStep = 1 | 2 | 3;

type Props = {
  step: CheckoutStep;
};

export function CheckoutProgress({ step }: Props) {
  const bar = (n: CheckoutStep) =>
    step >= n ? "bg-accent" : "bg-outline-variant";

  return (
    <div
      className="mb-8 flex max-w-[800px] items-center gap-1"
      aria-hidden
    >
      <div className={`h-0.5 flex-1 rounded-full ${bar(1)}`} />
      <div className={`h-0.5 w-24 shrink-0 rounded-full ${bar(2)}`} />
      <div className={`h-0.5 w-24 shrink-0 rounded-full ${bar(3)}`} />
    </div>
  );
}
