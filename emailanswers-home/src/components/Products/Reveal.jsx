import { useInView } from "./hooks";

// Fades + lifts its children in when they scroll into view.
export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, seen] = useInView({ threshold: 0.12 });
  return (
    <Tag ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`pr-reveal ${seen ? "in" : ""} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

// Splits a string into words that blur-rise one after another.
export function Words({ text, className = "", wordClass = "" }) {
  const [ref, seen] = useInView({ threshold: 0.3 });
  return (
    <span ref={ref} className={`${seen ? "in" : ""} ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className={`pr-word ${wordClass}`} style={{ "--i": i }}>{w}&nbsp;</span>
      ))}
    </span>
  );
}
