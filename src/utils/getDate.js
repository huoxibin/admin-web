import moment from 'moment';

const getCurrWeek = () => { //当周
	let start = moment().startOf('isoWeek').format('YYYY-MM-DD');
	let end = moment().endOf('isoWeek').format('YYYY-MM-DD');
	return {start, end}
};
const getCurrMonth = () => {//当月
	let start = moment().startOf('month').format('YYYY-MM-DD');
	let end = moment().endOf('month').endOf('month').format('YYYY-MM-DD');
	return {start, end}
};
const getCurrYear = () => { //当年
	let start = moment().startOf('year').format('YYYY-MM-DD');
	let end = moment().endOf('year').endOf('year').format('YYYY-MM-DD');
	return {start, end}
};
const getCurrDay = () => {//当天
	let start = moment().startOf('day').format('YYYY-MM-DD');
	let end = moment().endOf('day').endOf('day').format('YYYY-MM-DD');
	return {start, end}
};
const getCurrDayTime = () => {//当前时间
	let start = moment().format('YYYY-MM-DD hh:mm:ss');
	return {start}
};

const getPrevMonth = () => { // 上月
	const start = moment().month(moment().month() - 1).startOf('month').format('YYYY-MM-DD');
	const end = moment().month(moment().month() - 1).endOf('month').format('YYYY-MM-DD');
	return {start, end}
};
const getCurrQuality = () => { // 本季度
	const start = moment().quarter(moment().quarter()).startOf('quarter').format('YYYY-MM-DD');
	const end = moment().quarter(moment().quarter()).endOf('quarter').format('YYYY-MM-DD');
	return {start, end}
};
const getPrevQuality = () => { // 上季度
	const start = moment().quarter(moment().quarter() - 1).startOf('quarter').format('YYYY-MM-DD');
	const end = moment().quarter(moment().quarter() - 1).endOf('quarter').format('YYYY-MM-DD');
	return {start, end}
};
export {
	getCurrWeek,
	getCurrMonth,
	getCurrYear,
	getCurrDay,
	getCurrDayTime,
	getCurrQuality,
	getPrevMonth,
	getPrevQuality
};
