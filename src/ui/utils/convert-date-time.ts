export default function convertDateTime(utcString: string) {
    const utcDate = new Date(utcString);

    const vnDate = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000);

    const hours = vnDate.getHours().toString().padStart(2, '0');
    const minutes = vnDate.getMinutes().toString().padStart(2, '0');
    const day = vnDate.getDate().toString().padStart(2, '0');
    const month = (vnDate.getMonth() + 1).toString().padStart(2, '0');
    const year = vnDate.getFullYear();

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
}