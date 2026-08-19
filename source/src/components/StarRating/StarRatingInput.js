// components/StarRatingInput.jsx
import React from 'react';
import { StarFilled } from '@ant-design/icons';
import styles from './StarRating.module.scss';

const StarRatingInput = ({ value = 0, onChange, max = 5 }) => {
    const handleClick = (star) => {
        onChange?.(star);
    };

    return (
        <div className={styles['star-rating']}>
            {Array.from({ length: max }, (_, index) => {
                const star = index + 1;
                return (
                    <StarFilled
                        key={star}
                        className={`${styles['star-rating__icon']} ${index < value ? styles['star-rating__icon--filled'] : styles['star-rating__icon--empty']
                            }`}
                        onClick={() => handleClick(star)}
                        style={{ cursor: 'pointer' }}
                    />
                );
            })}
        </div>
    );
};

export default StarRatingInput;