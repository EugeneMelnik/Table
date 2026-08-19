import styles from './Pagination.module.scss';

export const Pagination = ({ page, setPage, limit, setLimit, totalCount }) => {
  const totalPages = totalCount && limit ? Math.ceil(totalCount / limit) : 0;

  const handleSetPage = (value) => {
    if (value < 1) return;
    if (value > totalPages) return;

    setPage(value);
  };

  const handleChangePage = (event) => {
    handleSetPage(+event.target.value);
  };

  const handleChangeLimit = (event) => {
    const nextLimit = event.target.value === 'all'
      ? totalCount
      : +event.target.value;
    const nextPage = Math.min(page, Math.max(1, Math.ceil(totalCount / nextLimit)));

    setLimit(nextLimit);
    setPage(nextPage);
  };

  return (
    <div className={styles.wrapper}>
      page
      <ul>
        <li className={styles.btn_prev}>
          <button onClick={() => handleSetPage(page - 1)} />
        </li>
        <li>{page}</li>
        <li className={styles.btn_next}>
          <button onClick={() => handleSetPage(page + 1)} />
        </li>
      </ul>
      <div>
        <label>
          Jump to page:
          <select value={page} onChange={handleChangePage}>
            {Array.from({ length: Math.max(totalPages, 1) }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Limit items per page:
          <select
            value={limit === totalCount ? 'all' : limit}
            onChange={handleChangeLimit}
          >
            {[5, 10, 20, 50]
              .filter((value, index, values) => value > 0 && values.indexOf(value) === index)
              .map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            {!!totalCount && <option value="all">All</option>}
          </select>
        </label>
      </div>
      <p>
        Total pages:
        {totalPages && <strong>{totalPages}</strong>}
      </p>
    </div>
  );
};
