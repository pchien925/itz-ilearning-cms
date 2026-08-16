// components/StarRatingInput.jsx
import React from 'react';
import { StarFilled } from '@ant-design/icons';
import './StarRating.scss';

const StarRatingInput = ({ value = 0, onChange, max = 5 }) => {
    const handleClick = (star) => {
        onChange?.(star);
    };

    return (
        <div className="star-rating">
            {Array.from({ length: max }, (_, index) => {
                const star = index + 1;
                return (
                    <StarFilled
                        key={star}
                        className={`star-rating__icon ${
                            star <= value ? 'star-rating__icon--filled' : 'star-rating__icon--empty'
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