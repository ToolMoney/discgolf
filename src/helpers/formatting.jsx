export function getValueOrDash(value) {
	if (!value && value !== 0) {
	    return "-";
	}
	return value;
}
