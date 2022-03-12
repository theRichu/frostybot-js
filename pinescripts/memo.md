
급등과 급락에 대한 대처

close (닫히지 않은 바에서, 현재가)
close-open 양수인 경우 오른것, 음수인 경우 내린것

만약 손실중에, 기존 n 개의 막대의 등락폭이 평균보다, k 퍼센트 이상의 손실방향으로 이동이 발생한다면, 바로 스탑로스


손실중임을 파악하기 위해서는?
구매 평균가보다, 현재가가 더 낮으면!

isBleeding = (strategy.position_size == 0)?false:(TradeDir == "LONG" ? strategy.position_avg_price > close : 	strategy.position_avg_price < close)

n 개의 막대 등락폭

recentNum = input.int(title='Recent Bars', defval=28)
surpriseThreshold = input.float(title='Surprise Threshold', defval=1.2, minval=0, maxval=50, step=.01)
// 평균 오른 비율
// 평균 내린 비율


f_avgUpDownPercent(_src, _cond, _cnt) =>
    float _sumPositive = sum(condition ? _src : 0, _cnt)
    float _sumNegative = sum(condition ? 0 : _src, _cnt)
    float _countPositive = sum(condition ? 1 : 0, _cnt)
    float _countNegative = sum(condition ? 0 : 1, _cnt)
    float _returnPositive = _sumPositive / _countPositive
    float _returnNegative = _sumNegative / _countNegative
    [_returnPositive, returnNegative]

source = ((close-open)/open)*100
bool condition = close > open

[upPercent, downPercent] = f_avgWhenInLastX3(source, condition, recentNum)

emergencyStopLong = false
emergencyStopShort = false

if(isBleeding)
	if(TradeDir == "LONG") 
	  emergencyStopLong := source < downPercent * (1 + surpriseThreshold)
	else if(TradeDir == "SHORT") 
		emergencyStopShort := source > upPercent * (1 + surpriseThreshold)


plot(average3, " Case 3 Average", color.orange)
plotchar(total3, "Case 3 Total", "", location.top, color.aqua)
plotchar(count3, "Case 3 Count", "", location.top, color.aqua)

2750.08
2751.23