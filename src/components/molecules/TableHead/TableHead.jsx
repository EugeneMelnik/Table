import { ACheckbox } from '../../atoms/ACheckbox/ACheckbox';
import { ColumnSorter } from '../../atoms/ColumnSorter/ColumnSorter';
import styles from './TableHead.module.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortSongs } from '../../../store/actions';
import { getSongsIdSelector } from '../../../store/selectors';

export const TableHead = ({ setSelectedRows, selectedRows }) => {
  const [activeSortParameter, setActiveSortParameter] = useState(null);
  const [isAscending, setIsAscending] = useState(true);

  const songsId = useSelector(getSongsIdSelector);

  const dispatch = useDispatch();

  const handleClickSortList = (sortParameter) => {
    if (activeSortParameter !== sortParameter) {
      setIsAscending(true);

      setActiveSortParameter(sortParameter);

      dispatch(sortSongs(sortParameter, true));
    } else {
      setIsAscending(!isAscending);

      dispatch(sortSongs(sortParameter, !isAscending));
    }
  };

  const handleClickSelectAllRows = () => {
    if (songsId.length === selectedRows.length) {
      setSelectedRows([]);

      return;
    }

    setSelectedRows(songsId);
  };

  return (
    <thead>
      <tr className={styles.wrapper}>
        <th>
          <ACheckbox
            onChange={handleClickSelectAllRows}
            isChecked={selectedRows.length === songsId.length}
          />
        </th>
        <th>
          <ColumnSorter
            title="Song"
            sortParameter="name"
            isAscending={isAscending}
            activeSortParameter={activeSortParameter}
            sort={handleClickSortList}
          />
        </th>
        <th>
          <ColumnSorter
            title="Band"
            sortParameter="band"
            isAscending={isAscending}
            activeSortParameter={activeSortParameter}
            sort={handleClickSortList}
          />
        </th>
        <th>
          <ColumnSorter
            title="Evaluation"
            sortParameter="rating"
            isAscending={isAscending}
            activeSortParameter={activeSortParameter}
            sort={handleClickSortList}
          />
        </th>
        <th>
          <ColumnSorter
            title="Location"
            sortParameter="location"
            isAscending={isAscending}
            activeSortParameter={activeSortParameter}
            sort={handleClickSortList}
          />
        </th>
        <th>Actions</th>
      </tr>
    </thead>
  );
};
