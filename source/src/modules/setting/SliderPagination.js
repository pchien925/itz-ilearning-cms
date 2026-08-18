import React from 'react';
import { Button, Space } from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './SliderPagination.module.scss';

const SliderPagination = ({ activeIndex, setActiveIndex, slider, handleAddSlider }) => {
    return (
        <div className={styles.wrapper}>
            <Space>
                <Button
                    className={styles.navButton}
                    icon={<LeftOutlined />}
                    onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeIndex === 0}
                    type="text"
                />
                {slider.map((_, idx) => (
                    <Button
                        key={idx}
                        className={activeIndex === idx ? styles.pageButtonActive : styles.pageButton}
                        type={activeIndex === idx ? 'primary' : 'default'}
                        onClick={() => setActiveIndex(idx)}
                    >
                        {idx + 1}
                    </Button>
                ))}
                <Button className={styles.addButton} icon={<PlusOutlined />} onClick={handleAddSlider} type="dashed" />
                {/* <Button
                    className={styles.navButton}
                    icon={<RightOutlined />}
                    onClick={() => setActiveIndex((prev) => Math.min(slider.length - 1, prev + 1))}
                    disabled={activeIndex === slider.length - 1}
                    type="text"
                /> */}
            </Space>
        </div>
    );
};

export default SliderPagination;