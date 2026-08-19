import styles from './DetailsPage.module.scss';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTargetSongSelector } from '../../../store/selectors';
import {
  deleteSongsThunk,
  getSongThunk,
  setSongRatingThunk,
} from '../../../store/actions';
import { useHistory, useParams } from 'react-router-dom';
import { Rating } from '../../atoms/Rating/Rating';

export const DetailsPage = () => {
  const { id } = useParams();

  const song = useSelector(getTargetSongSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getSongThunk(id));
  }, [id]);

  const handleDelete = () => {
    dispatch(deleteSongsThunk([song]));
    history.push('/songs');
  };

  const handleEdit = () => {
    history.push(`/add-song/${id}`);
  };

  const handleSetRating = (event) => {
    dispatch(setSongRatingThunk(id, +event.target.value, song.name));
  };

  return (
    <div className={styles.wrapper}>
      {song && (
        <>
          <div className={styles.head}>
            <h3>{song.band}</h3>
            <strong>{song.name}</strong>
            <div className={styles.actions}>
              <button
                className={styles.iconButton}
                onClick={handleEdit}
                aria-label={`Edit ${song.name}`}
                title="Edit"
              >
                <span aria-hidden="true">&#9998;</span>
              </button>
              <button
                className={styles.iconButton}
                onClick={handleDelete}
                aria-label={`Delete ${song.name}`}
                title="Delete"
              >
                <span aria-hidden="true">&#10005;</span>
              </button>
            </div>
          </div>
          <img src={song.photo} alt={song.band} />
          <p>{song.details}</p>
          <p>{song.location}</p>
          <Rating
            onChange={handleSetRating}
            value={song.rating}
            name={`rating${song.id}`}
          />
        </>
      )}
    </div>
  );
};
