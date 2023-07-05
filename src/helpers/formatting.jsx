export function getValueOrDash(value) {
	if (!value && value !== 0) {
	    return "-";
	}
	return value;
}

export function getDateDisplayValue(dateString) {
	console.log(dateString);
	return (new Date(dateString)).toLocaleString('en-US', {
		dateStyle: "medium",
		timeStyle: "short",
	})
}

export function getDateLocalValue(date) {
	const addPad = n => ('0' + n).slice(-2);
	
	return (
		date.getFullYear() + '-' +
		addPad(date.getMonth() + 1) + '-' +
		addPad(date.getDate()) + 'T' +
		addPad(date.getHours()) + ':'  +
		addPad(date.getMinutes())
	)
}