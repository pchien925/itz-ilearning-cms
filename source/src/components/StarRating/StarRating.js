import React from 'react';
import { StarFilled } from '@ant-design/icons';
import './StarRating.scss';

const StarRating = ({ value = 0, max = 5 }) => {
    return (
        <div className="star-rating">
            {Array.from({ length: max }, (_, index) => (
                <StarFilled
                    key={index}
                    className={`star-rating__icon ${
                        index < value ? 'star-rating__icon--filled' : 'star-rating__icon--empty'
                    }`}
                />
            ))}
        </div>
    );
};

export default StarRating;