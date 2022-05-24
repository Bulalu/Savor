import React from 'react';
import { Pie } from '@ant-design/charts';

const DemoPie = (props) => {
  console.log("DemoPie : "+JSON.stringify(props));



  const config = {
    appendPadding: 10,
    data: props.vaultAssetsBreakdown,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: function content(_ref) {
        return ''.concat(_ref.value, '%');
      },
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
    theme: {
      colors10: [
        '#1890FF',
        '#21BF96',
        '#ffa500',
        '#1890FF',
        '#21BF96',
        '#ffa500',
        '#1890FF',
        '#21BF96',
        '#ffa500',
        '#1890FF',
      ]
    }
  };
  return <Pie {...config} />;
};

export default DemoPie;
