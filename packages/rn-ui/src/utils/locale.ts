import { LocaleConfig } from "react-native-calendars";

export interface LocaleData {
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
  today?: string;
}

export type LocaleInput = string | Partial<LocaleData>;

// Built-in English (default)
const enLocale: LocaleData = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};

// Built-in Indonesian (id)
const idLocale: LocaleData = {
  monthNames: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  dayNames: [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ],
  dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  today: "Hari Ini",
};

// Built-in French (fr)
const frLocale: LocaleData = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};

// Built-in Spanish (es)
const esLocale: LocaleData = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
  today: "Hoy",
};

// Register default locales into LocaleConfig
LocaleConfig.locales = {
  "": enLocale,
  en: enLocale,
  id: idLocale,
  fr: frLocale,
  es: esLocale,
  ...LocaleConfig.locales,
};

if (!LocaleConfig.defaultLocale) {
  LocaleConfig.defaultLocale = "en";
}

/**
 * Get resolved locale data from string ID, LocaleConfig, or inline object
 */
export function getLocaleData(locale?: LocaleInput): LocaleData {
  if (typeof locale === "object" && locale !== null) {
    const monthNames =
      Array.isArray(locale.monthNames) && locale.monthNames.length === 12
        ? locale.monthNames
        : enLocale.monthNames;
    const monthNamesShort =
      Array.isArray(locale.monthNamesShort) && locale.monthNamesShort.length === 12
        ? locale.monthNamesShort
        : monthNames.map((m) => m.slice(0, 3));
    const dayNames =
      Array.isArray(locale.dayNames) && locale.dayNames.length === 7
        ? locale.dayNames
        : enLocale.dayNames;
    const dayNamesShort =
      Array.isArray(locale.dayNamesShort) && locale.dayNamesShort.length === 7
        ? locale.dayNamesShort
        : dayNames.map((d) => d.slice(0, 3));
    return {
      monthNames,
      monthNamesShort,
      dayNames,
      dayNamesShort,
      today: locale.today || "Today",
    };
  }

  const activeKey = typeof locale === "string" ? locale : LocaleConfig.defaultLocale || "en";
  const found = LocaleConfig.locales[activeKey] as LocaleData | undefined;

  if (found && Array.isArray(found.monthNames) && found.monthNames.length === 12) {
    return {
      monthNames: found.monthNames,
      monthNamesShort: found.monthNamesShort || found.monthNames.map((m) => m.slice(0, 3)),
      dayNames: found.dayNames || enLocale.dayNames,
      dayNamesShort: found.dayNamesShort || enLocale.dayNamesShort,
      today: found.today || "Today",
    };
  }

  return enLocale;
}

export { LocaleConfig };
