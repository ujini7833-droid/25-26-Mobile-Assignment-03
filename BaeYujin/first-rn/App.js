import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native';

const GAP = 3;
const NUM_BUTTONS = ['7','8','9','4','5','6','1','2','3','0','='];
const OPS = ['C','-','+'];

const Btn = ({ label, onPress, type='num', style }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.btnBase,
      type === 'op' && styles.opBtn,
      style,
      pressed && styles.pressed
    ]}
  >
    <Text style={styles.btnText}>{label}</Text>
  </Pressable>
);

export default function App() {
  const { width, height } = useWindowDimensions();
  const SIZE = (width - GAP * 4) / 4;

  const [result, setResult] = useState(0);
  const [formula, setFormula] = useState([]);

  const calculator = (arr) => {
    try {
      const exp = arr.join('');
      const val = eval(exp);
      return Number.isFinite(val) ? val : 'Err';
    } catch {
      return 'Err';
    }
  };

  const onPressNumber = (number) => {
    const last = formula[formula.length - 1];
    if (isNaN(last)) {
      setResult(number);
      setFormula(prev => [...prev, Number(number)]);
    } else {
      const newNumber = (last ?? 0) * 10 + Number(number);
      setResult(newNumber);
      setFormula(prev => {
        const copy = [...prev];
        copy.pop();
        return [...copy, newNumber];
      });
    }
  };

  const onPressOperator = (operator) => {
    switch (operator) {
      case 'C':
        setFormula([]);
        setResult(0);
        return;
      case '=': {
        const val = calculator(formula);
        setResult(val);
        setFormula([val]);
        return;
      }
      default: {
        const last = formula[formula.length - 1];
        if (['+','-'].includes(last)) {
          setFormula(prev => {
            const copy = [...prev];
            copy.pop();
            return [...copy, operator];
          });
        } else {
          setFormula(prev => [...prev, operator]);
        }
      }
    }
  };

  const formattedResult = String(result).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.display}>
        <Text style={[styles.resultText, { fontSize: width * 0.16 }]}>{formattedResult}</Text>
      </View>

      <View style={[styles.mainRow, { gap: GAP }]}>
        <View
          style={[
            styles.leftGrid,
            {
              width: SIZE * 3 + GAP * 2,
              rowGap: GAP,
              columnGap: GAP,
            },
          ]}
        >
          {NUM_BUTTONS.map((label) => {
            if (label === '0')
              return <Btn key={label} label={label} onPress={() => onPressNumber(label)} style={{ width: SIZE * 2 + GAP, height: SIZE }} />;
            if (label === '=')
              return <Btn key={label} label={label} onPress={() => onPressOperator(label)} type="op" style={{ width: SIZE, height: SIZE }} />;
            return <Btn key={label} label={label} onPress={() => onPressNumber(label)} style={{ width: SIZE, height: SIZE }} />;
          })}
        </View>

        <View style={[styles.rightCol, { width: SIZE, gap: GAP }]}>
          <Btn label="C" type="op" onPress={() => onPressOperator('C')} style={{ width: SIZE, height: SIZE }} />
          <Btn label="-" type="op" onPress={() => onPressOperator('-')} style={{ width: SIZE, height: SIZE }} />
          <Btn label="+" type="op" onPress={() => onPressOperator('+')} style={{ width: SIZE, height: SIZE * 2 + GAP }} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  display: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  resultText: {
    color: 'white',
    textAlign: 'right',
    fontWeight: '600',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingBottom: 0,
  },
  leftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rightCol: {
    flexDirection: 'column',
  },
  btnBase: {
    backgroundColor: '#505050',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  btnText: {
    color: 'white',
    fontWeight: 'normal',
    fontSize: 45, 
  },
  pressed: { opacity: 0.6 },
  opBtn: { backgroundColor: '#f39c12' },
});
