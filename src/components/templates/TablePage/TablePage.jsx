import { AButton } from '../../atoms/AButton/AButton';
import { TableHead } from '../../molecules/TableHead/TableHead';
import { TableBody } from '../../organisms/TableBody/TableBody';
import { useEffect, useState } from 'react';
import { Pagination } from '../../molecules/Pagination/Pagination';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import { deleteSongsThunk, getSongsThunk } from '../../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSongsCountSelector } from '../../../store/selectors';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../../constants/ROUTES';
import styles from './TablePage.module.scss';

export const TablePage = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const initialPage = Number(searchParams.get('page')) || 1;
  const initialLimit = Number(searchParams.get('limit')) || 20;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limitItemsPerPage, setLimitItemsPerPage] = useState(initialLimit);
  const songs = useSelector((state) => state.reducer.songs);

  const allSongsCount = useSelector(getAllSongsCountSelector);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    setSelectedRows([]);

    history.push({
      pathname: ROUTES.songs,
      search: `?page=${currentPage}&limit=${limitItemsPerPage}`,
    });
    dispatch(getSongsThunk(currentPage, limitItemsPerPage));
  }, [currentPage, limitItemsPerPage, dispatch, history]);

  const handleClickDeleteSelectedRows = () => {
    dispatch(
      deleteSongsThunk(
        selectedRows.map((id) => songs.find((song) => song.id === id))
      )
    );
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows([...selectedRows.filter((rowId) => rowId !== id)]);
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className={styles.wrapper}>
      {!!selectedRows.length && (
        <AButton
          onClick={async () => {
            await handleClickDeleteSelectedRows();
          }}
        >
          Delete
        </AButton>
      )}
      <table>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <TableHead
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
        />
        <TableBody selectedRows={selectedRows} selectRow={handleSelectRow} />
        <tfoot>
          <tr>
            <td colSpan="7">
              <Pagination
                setPage={setCurrentPage}
                page={currentPage}
                limit={limitItemsPerPage}
                setLimit={setLimitItemsPerPage}
                totalCount={allSongsCount}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};
