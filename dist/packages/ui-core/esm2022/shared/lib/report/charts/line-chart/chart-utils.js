import colorLib from '@kurkle/color';
export class ChartUtil {
    static { this.COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ]; }
    static { this.CHART_COLORS = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(0, 214, 143)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    }; }
    constructor() { }
    static color(index) {
        return ChartUtil.COLORS[index % ChartUtil.COLORS.length];
    }
    static transparentize(value, opacity) {
        var alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return colorLib(value).alpha(alpha).rgbString();
    }
    static { this.NAMED_COLORS = [
        ChartUtil.CHART_COLORS.red,
        ChartUtil.CHART_COLORS.orange,
        ChartUtil.CHART_COLORS.yellow,
        ChartUtil.CHART_COLORS.green,
        ChartUtil.CHART_COLORS.blue,
        ChartUtil.CHART_COLORS.purple,
        ChartUtil.CHART_COLORS.grey,
    ]; }
    static namedColor(index) {
        return ChartUtil.NAMED_COLORS[index % ChartUtil.NAMED_COLORS.length];
    }
}
//# sourceMappingURL=chart-utils.js.map