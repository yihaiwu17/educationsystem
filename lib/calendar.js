import 'antd/es/calendar/style';
import generateCalendar from 'antd/lib/calendar/generateCalendar';
import dateFnsGenerateConfig from 'rc-picker/lib/generate/dateFns';

const Calendar = generateCalendar(dateFnsGenerateConfig);

export default Calendar;