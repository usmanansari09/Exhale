import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Sidebar from './sidebar';
import Exercise from './exercise';
import './../../../container/Layout/Dashboard/layout.css';
import ExerciseList from './exerciseList';
import ProfessionalDashboard from './professional';

import ClassesList from './classesList';
import ClassesDetailPage from './classesDetail';
import DetailPage from './detail';
import PolicyPage from './policy';
import TermsPage from './terms';
import Header from './header';

const Dashboard = () => {
  let role = localStorage.getItem('role');

  return (
    <BrowserRouter>
      <div className="main__wrapper">
        <div className="sidebar_wrapper">
          <Sidebar />
        </div>
        <div className="content__wrapper">
          <div>
            <Header />
          </div>
          <Switch>
            {role === 'professional' ? (
              <Route path="/dashboard" exact component={ProfessionalDashboard} />
            ) : (
              <Route path="/dashboard" exact component={Exercise} />
            )}

            <Route path="/dashboard/list" exact component={ExerciseList} />
            <Route path="/dashboard/classesList" exact component={ClassesList} />
            <Route path="/dashboard/classesDetail" exact component={ClassesDetailPage} />
            <Route path="/dashboard/detail" exact component={DetailPage} />
            <Route path="/dashboard/policy" exact component={PolicyPage} />
            <Route path="/dashboard/terms" exact component={TermsPage} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Dashboard;

// import React from 'react';
// import { Switch, Route, withRouter, Redirect ,BrowserRouter} from 'react-router-dom';

// import Sidebar from './sidebar';
// import Detail from './detail';
// import Exercise from './exercise';
// import './../../../container/Layout/Dashboard/layout.css';

// const Dashboard =() =>{
//     return(
//         <BrowserRouter>
//            <div className='main_wrapper'>
//              <div className='sidebar_wrapper'>
//               <Sidebar/>
//             </div>
//             <div className='routes_wrapper'>
//             <Switch>
//                     <Route path="/dashboard" exact  component={Exercise} />
//                     <Route path="/dashboard/detail"  component={Detail} />
//             </Switch>
//             </div>
//         </div>
//         </BrowserRouter>
//     )
// }

// export default Dashboard;
