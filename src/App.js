import { Redirect, Route, Switch } from 'react-router-dom';
import { Tab } from './components/atoms/Tab/Tab';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './App.scss';
import { DetailsPage } from './components/templates/DetailsPage/DetailsPage';
import { ROUTES } from './constants/ROUTES';
import { FormPage } from './components/templates/FormPage/FormPage';
import { TablePage } from './components/templates/TablePage/TablePage';
import { Loader } from './components/atoms/Loader/Loader';
import { useSelector } from 'react-redux';
import { getIsLoadingSelector } from './store/selectors';

function App() {
  const isLoading = useSelector(getIsLoadingSelector);

  return (
    <div className="App">
      {isLoading && <Loader />}
      <div className="container">
        <nav>
          <Tab to={ROUTES.songs} title="Table" />
          <Tab to={ROUTES.addSong} title="Add" />
        </nav>
        <div>
          <Switch>
            <Route exact path={ROUTES.root}>
              <Redirect to={ROUTES.songs} />
            </Route>
            <Route exact path={ROUTES.songs} component={TablePage} />
            <Route path={`${ROUTES.addSong}/:id`} component={FormPage} />
            <Route exact path={ROUTES.addSong} component={FormPage} />
            <Route path={ROUTES.song} component={DetailsPage} />
          </Switch>
        </div>
      </div>
      <ToastContainer progressClassName={styles.toastProgressBar} />
    </div>
  );
}

export default App;
