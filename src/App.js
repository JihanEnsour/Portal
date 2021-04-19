import React from "react";
import { Root } from "native-base";
// import { StackNavigator, DrawerNavigator } from "react-navigation";
import {
  createDrawerNavigator,
  createStackNavigator,
  createAppContainer,
} from "react-navigation";


import SentTasks from "./screens/SentTasks";
import BasicCard from "./screens/basic";
import NewsDetails from "./screens/NewsDetails";
import NHCardShowcase from "./screens/card-showcase";
import EmpsContacts from "./screens/EmpsContacts";
import AchivedTasks from "./screens/AchivedTasks";
import EmpsConatctDetails from "./screens/EmpsConatctDetails";
import Survey from "./screens/survey";
import TaskDetails from "./screens/TaskDetails";
import RecievedTasks from "./screens/RecievedTasks";
import ProcessTask from "./screens/ProcessTask";
import CreateATask from "./screens/CreateATask";
import AddNews from "./screens/AddNews";
import CreateEmpOfMonth from "./screens/CreateEmpOfMonth";
import ManageSalary from "./screens/ManageSalary";
import DeptTasks from "./screens/DeptTasks";
import ManageEmpOfMonth from "./screens/ManageEmpOfMonth";
import ManageApp from "./screens/ManageApp";
import DisabledInput from "./screens/disabledInput";
import Tasks from "./screens/Tasks";
import ManageNews from "./screens/ManageNews";
import WorkingReport from "./screens/WorkingReport";
import EmpOfMonth from "./screens/EmpOfMonth";
import Vacations from "./screens/vacations";
import News from "./screens/News";
import Salary from "./screens/salary";
import forgetPassword from "./screens/forgetPassword";
import PersonalData from "./screens/PersonalData";
import MainMenu from "./screens/MainMenu";
import BasicTab from "./screens/basicTab";
import AccordionDefault from "./screens/DigitalSignature/accordion-default";
import SelfWorkCorrectionList from "./screens/DigitalSignature/accordion-icon";
import DeptWorkCorrectionList from "./screens/DigitalSignature/deptWorkCorrectionList";
import MergedLocationWithQRCode from "./screens/DigitalSignature/locationAndQRScanner";
import AccordionHeaderContentStyle from "./screens/DigitalSignature/accordion-header-content-style";
import AccordionCustomHeaderContent from "./screens/DigitalSignature/accordion-custom-header-content";
import CorrectTheWrok from "./screens/DigitalSignature/correctTheWrok";
import QRCodeDataScanner from "./screens/DigitalSignature/QRCodeDataScanner";
import LocationAndQRScannerModified from "./screens/DigitalSignature/locationAndQRScannerModified";
import workCorrectionHome from "./screens/DigitalSignature/workCorrectionHome";
import approveMyDeptWorkCorrection from "./screens/DigitalSignature/approveMyDeptWorkCorrection";
import urgentSigniture from "./screens/DigitalSignature/urgentSigniture";
import vacatonsDetails from "./screens/vacatonsDetails";
import RecievedTaskDetails from "./screens/RecievedTaskDetails";
import Feedback from "./screens/Feedback";

import Home from "./screens/home/";
import NHCard from "./screens/";
import NHForm from "./screens/NHForm";
import SideBar from "./screens/sidebar";

const Drawer = createDrawerNavigator(
  {
    Home: { screen: Home },
    NHCard: { screen: NHCard },
    NHForm: { screen: NHForm },
  },
  {
    initialRouteName: "Home",
    contentOptions: {
      activeTintColor: "#e91e63",
    },
    contentComponent: (props) => <SideBar {...props} />,
    drawerLockMode: "locked-closed",
  }
);

const AppNavigator = createStackNavigator(
  {
    Drawer: { screen: Drawer },

    MainMenu: { screen: MainMenu },

    //Tasks
    BasicTab: { screen: BasicTab },
    Tasks: { screen: Tasks },
    CreateATask: { screen: CreateATask },
    SentTasks: { screen: SentTasks },
    RecievedTasks: { screen: RecievedTasks },
    ProcessTask: { screen: ProcessTask },
    DeptTasks: { screen: DeptTasks },
    AchivedTasks: { screen: AchivedTasks },
    TaskDetails: { screen: TaskDetails },
    DisabledInput: { screen: DisabledInput },
    RecievedTaskDetails: { screen: RecievedTaskDetails },

    //Survey
    BasicCard: { screen: BasicCard },
    Survey: { screen: Survey },
    NHCardShowcase: { screen: NHCardShowcase },

    //News
    NewsDetails: { screen: NewsDetails },
    News: { screen: News },
    ManageNews: { screen: ManageNews },
    AddNews: { screen: AddNews },

    //Contacts
    EmpsContacts: { screen: EmpsContacts },
    EmpsConatctDetails: { screen: EmpsConatctDetails },

    //Emp of the month
    EmpOfMonth: { screen: EmpOfMonth },
    ManageEmpOfMonth: {screen: ManageEmpOfMonth},
    CreateEmpOfMonth: { screen: CreateEmpOfMonth },

    //Manage Application
    ManageApp: { screen: ManageApp },
    ManageSalary: { screen: ManageSalary },
    forgetPassword: { screen: forgetPassword },
    Feedback: {screen: Feedback},


    //HR
    WorkingReport: { screen: WorkingReport },
    Vacations: { screen: Vacations },
    vacatonsDetails: { screen: vacatonsDetails },
    workCorrectionHome: { screen: workCorrectionHome },
    SelfWorkCorrectionList: { screen: SelfWorkCorrectionList },
    DeptWorkCorrectionList: { screen: DeptWorkCorrectionList },
    approveMyDeptWorkCorrection: { screen: approveMyDeptWorkCorrection },
    CorrectTheWrok: { screen: CorrectTheWrok },
    Salary: { screen: Salary },
    PersonalData: { screen: PersonalData },

    //Digital Signature
    urgentSigniture: { screen: urgentSigniture },
    MergedLocationWithQRCode: { screen: MergedLocationWithQRCode },
    LocationAndQRScannerModified: {screen: LocationAndQRScannerModified},

    //Tests
    AccordionDefault: { screen: AccordionDefault },
    AccordionHeaderContentStyle: { screen: AccordionHeaderContentStyle },
    AccordionCustomHeaderContent: { screen: AccordionCustomHeaderContent },
    QRCodeDataScanner: { screen: QRCodeDataScanner },
  },
  {
    initialRouteName: "Drawer",
    headerMode: "none",
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default () => (
  <Root>
    <AppContainer />
  </Root>
);
