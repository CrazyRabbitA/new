import Sidebar from 'components/layout/TuiaSidebar';
import Subnav from 'components/layout/Subnav';
import PageTitle from 'components/layout/PageTitle';
import Hidebar from 'components/layout/Hidebar';
import Loading from 'components/layout/Loading';
import TableEmpty from 'components/layout/TableEmpty';
import CopyModal from 'components/layout/CopyModal';
import InvalidTip from 'components/forms/InvalidTip';
import Richeditor from 'components/forms/Richeditor';
import Button from 'components/basic/Button';
import Alert from 'components/basic/Alert';
import Breadcrumb from 'components/basic/Breadcrumb';
import BreadcrumbItem from 'components/basic/BreadcrumbItem';
import Checkbox from 'components/basic/Checkbox';
import CheckboxGroup from 'components/basic/CheckboxGroup';
import Select from 'components/basic/Select';
import Tooltip from 'components/basic/Tooltip';
import Pagination from 'components/basic/Pagination';
import ImageUpload from 'components/basic/ImageUpload';
import Switch from 'components/basic/Switch';
import Modal from 'components/basic/Modal';
import Daterangepicker from 'components/forms/Daterangepicker';
import Datepicker from 'components/forms/Datepicker';

const Components = {
  Sidebar,
  Subnav,
  PageTitle,
  Hidebar,
  Loading,
  TableEmpty,
  CopyModal,
  Daterangepicker,
  Datepicker,
  Richeditor,
  Button,
  Modal,
  Alert,
  Checkbox,
  CheckboxGroup,
  Select,
  Breadcrumb,
  BreadcrumbItem,
  Tooltip,
  Pagination,
  InvalidTip,
  ImageUpload,
  Switch
};

export default function(Vue) {
  var keys = Object.keys(Components);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let component = Components[key];
    Vue.component(component.name || key.toLowerCase(), Components[key]);
  }
}
