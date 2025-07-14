import { useI18n } from '../../../i18n/mainI18n';
import './statistic.scss';
const Statistics: React.FC = () => {
    const i18n = useI18n((i18n) => {
        return { general: i18n.general };
    });
    return <div className="still-in-develop-div">{i18n.general.stillUnderDevelop}</div>;
};
export default Statistics;
