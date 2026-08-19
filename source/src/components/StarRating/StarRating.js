import React from 'react';
import { StarFilled } from '@ant-design/icons';
import styles from './StarRating.module.scss';

const StarRating = ({ value = 0, max = 5 }) => {
    return (
        <div className={styles['star-rating']}>
            {Array.from({ length: max }, (_, index) => (
                <StarFilled
                    key={index}
                    className={`${styles['star-rating__icon']} ${
                        index < value ? styles['star-rating__icon--filled'] : styles['star-rating__icon--empty']
                    }`}
                />
            ))}
        </div>
    );
};

export default StarRating;