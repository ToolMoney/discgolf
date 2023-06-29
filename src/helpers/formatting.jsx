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