import {
    safeQuery,
    safeId
} from "./../../utils/dom.js"

//données du calendrier
export const scheduleCommandIcons = {
    plus : safeId("calendarMenu__icons--plus"),
    search : safeId("calendarMenu__icons--search"),
    large : safeId("calendarMenu__icons--large")
}
export const scheduleCommandButton = safeQuery(".calendarMenu__menu");