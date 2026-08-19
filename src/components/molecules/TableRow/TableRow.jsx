import { ACheckbox } from '../../atoms/ACheckbox/ACheckbox';
import { Rating } from '../../atoms/Rating/Rating';
import styles from './TableRow.module.scss';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteSongsThunk, setSongRatingThunk } from '../../../store/actions';

export const TableRow = ({
  id,
  band,
  name,
  rating,
  location,
  isChecked,
  selectRow,
}) => {
  const history = useHistory();

  const dispatch = useDispatch();

  const handleClickShowSong = () => {
    history.push(`/songs/${id}`);
  };

  const handleClickDeleteRow = () => {
    dispatch(deleteSongsThunk([{ id, name }]));
  };

  const handleClickEditRow = () => {
    history.push(`/add-song/${id}`);
  };

  const handleSetSongRating = (event) => {
    dispatch(setSongRatingThunk(id, +event.target.value, name));
  };

  return (
    <tr className={styles.wrapper}>
      <td>
        <ACheckbox
          value={id}
          onChange={() => selectRow(id)}
          isChecked={isChecked}
        />
      </td>
      <td onClick={handleClickShowSong}>{name}</td>
      <td>{band}</td>
      <td>
        <Rating
          onChange={handleSetSongRating}
          value={rating}
          name={`rating${id}`}
        />
      </td>
      <td>{location}</td>
      <td className={styles.actions}>
        <button
          className={styles.iconButton}
          onClick={handleClickEditRow}
          aria-label={`Edit ${name}`}
          title="Edit"
        >
          <span aria-hidden="true">&#9998;</span>
        </button>
        <button
          className={styles.iconButton}
          onClick={handleClickDeleteRow}
          aria-label={`Delete ${name}`}
          title="Delete"
        >
          <span aria-hidden="true">&#10005;</span>
        </button>
      </td>
    </tr>
  );
};
