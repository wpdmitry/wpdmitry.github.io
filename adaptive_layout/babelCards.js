'use strict';

var labelsForDevice = [{
    device: 'mobile',
    imageSize: '2',
    transition: {
        's': 's',
        'm': 's',
        'l': 's'
    },
    screen: [0, 425]
}, {
    device: 'tablet',
    imageSize: '2',
    transition: {
        's': 's',
        'm': 'm',
        'l': 'm'
    },
    screen: [425, 768]
}, {
    device: 'laptop',
    imageSize: '3',
    transition: {
        's': 's',
        'm': 'm',
        'l': 'l'
    },
    screen: [768, 1440]
}, {
    device: 'desktop',
    imageSize: '3',
    transition: {
        's': 's',
        'm': 'm',
        'l': 'l'
    },
    screen: [1440, Infinity]
}];

function getHTMLCards(data) {
    var _labelsForDevice$filt = labelsForDevice.filter(function (device) {
        var clientDevice = screen.width;
        return clientDevice > device.screen[0] && clientDevice <= device.screen[1];
    })[0],
        transition = _labelsForDevice$filt.transition,
        imageSize = _labelsForDevice$filt.imageSize;


    return data.reduce(function (html, d) {
        var size = transition[d.size];
        var title = d.title;
        var titleColor = d.titleColor;
        var image = d.image;
        var desc = d.description;
        var channelName = d.channelName;

        var imgHTML = image ? '\n            <img \n                src="' + image.replace('.', '@' + imageSize + 'x.') + '" \n                class="card__image card__image_size_' + size + '"\n            />' : '';

        var descHTML = desc ? '\n            <div class="card__description card__description_size_' + size + ' YSText-Regular">\n                ' + desc + ';\n            </div>' : '';

        var authorHTML = channelName ? '\n            <div class="author YSText-Bold">' + channelName + '</div>' : '';

        html += '\n            <div class="card card_size_' + size + '">\n                 <div \n                    class="card__title card__title_size_' + size + ' YSText-Bold"\n                    style="color: ' + titleColor + '"\n                  >\n                     ' + title + '\n                </div>  \n                \n                 ' + imgHTML + '\n                 ' + descHTML + '\n                 \n                 <div class="card__toolbox \n                             card__toolbox_size_' + size + '\n                             ' + (channelName ? 'card__toolbox_down' : '') + '"\n                 >  \n                    ' + authorHTML + '\n                    ' + getHTMLButtons() + '    \n                </div>\n            </div>\n        ';

        return html;
    }, '');
}

function getHTMLButtons() {
    return '\n            <img src="img/Actions.png" class="actions">\n            <img src="img/Heart.png" class="heart">\n        \n    ';
}
