import type { EventInput } from "@fullcalendar/core";

export function icsDateToIso(dateString: string): string {
  if (!dateString) return "";
  const cleaned = dateString.trim().replace(/\r/g, "");
  if (/^\d{8}$/.test(cleaned)) {
    const [, yyyy, mm, dd] = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/) || [];
    return `${yyyy}-${mm}-${dd}`;
  }
  const timeMatch = cleaned.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/);
  if (timeMatch) {
    const [, yyyy, mm, dd, hh, mi, ss, z] = timeMatch;
    return z ? `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z` : `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}`;
  }
  return cleaned;
}

function parseVEvent(veventText: string): EventInput | null {
  const endIdx = veventText.indexOf("END:VEVENT");
  const body = endIdx >= 0 ? veventText.slice(0, endIdx) : veventText;

  const getProperty = (propName: string): string => {
    const regex = new RegExp(`^${propName}(:|;[^:]*:)(.*)$`, "im");
    const match = body.match(regex);
    return match ? match[2].trim() : "";
  };

  const summary = getProperty("SUMMARY") || "（无标题）";
  const dtstartRaw = getProperty("DTSTART") || getProperty("DTSTART;VALUE=DATE");
  if (!dtstartRaw) return null;

  const isoDate = icsDateToIso(dtstartRaw);
  if (!isoDate) return null;

  const isAllDay = /^\d{4}-\d{2}-\d{2}$/.test(isoDate);
  return { title: summary, start: isoDate, allDay: isAllDay };
}

export function parseIcsToEvents(icsText: string): EventInput[] {
  if (!icsText) return [];
  const unfoldedText = icsText.replace(/\r\n[ \t]/g, "");
  const vevents = unfoldedText.split(/BEGIN:VEVENT/).slice(1);
  return vevents.map((v) => parseVEvent(v)).filter(Boolean) as EventInput[];
}

export function isValidIcs(icsText: string): boolean {
  return /BEGIN:VCALENDAR/i.test(icsText);
}
