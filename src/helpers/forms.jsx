export function getObjectFromForm(formElement) {
    const formData = new FormData(formElement);
    const fields = Object.fromEntries(formData.entries());

    for (let prop in fields) {
        if (fields[prop] === "") {
            fields[prop] = null;
        }
    }
    return fields;
}
