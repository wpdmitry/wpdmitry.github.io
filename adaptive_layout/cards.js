const labelsForDevice = [
    {
        device: 'mobile',
        imageSize: '2',
        transition: {
            's': 's',
            'm': 's',
            'l': 's',
        },
        screen: [0, 425],
    },
    {
        device: 'tablet',
        imageSize: '2',
        transition: {
            's': 's',
            'm': 'm',
            'l': 'm',
        },
        screen: [425, 768],
    },
    {
        device: 'laptop',
        imageSize: '3',
        transition: {
            's': 's',
            'm': 'm',
            'l': 'l',
        },
        screen: [768, 1440],
    },
    {
        device: 'desktop',
        imageSize: '3',
        transition: {
            's': 's',
            'm': 'm',
            'l': 'l',
        },
        screen: [1440, Infinity],
    }
];

function getHTMLCards(data) {
    const {transition, imageSize} = labelsForDevice.filter(device => {
        const clientDevice = screen.width;
        return clientDevice > device.screen[0] && clientDevice <= device.screen[1];
    })[0];


    return data.reduce((html, d) => {
        const size = transition[d.size];
        const title = d.title;
        const titleColor = d.titleColor;
        const image = d.image;
        const desc = d.description;
        const channelName = d.channelName;

        const imgHTML = image ? `
            <img 
                src="${image.replace('.', `@${imageSize}x.`)}" 
                class="card__image card__image_size_${size}"
            />`
            :
            '';

        const descHTML = desc ? `
            <div class="card__description card__description_size_${size} YSText-Regular">
                ${desc};
            </div>`
            :
            '';

        const authorHTML = channelName ? `
            <div class="author YSText-Bold">${channelName}</div>`
            :
            '';

        html += `
            <div class="card card_size_${size}">
                 <div 
                    class="card__title card__title_size_${size} YSText-Bold"
                    style="color: ${titleColor}"
                  >
                     ${title}
                </div>  
                
                 ${imgHTML}
                 ${descHTML}
                 
                 <div class="card__toolbox 
                             card__toolbox_size_${size}
                             ${channelName ? 'card__toolbox_down' : ''}"
                 >  
                    ${authorHTML}
                    ${getHTMLButtons()}    
                </div>
            </div>
        `;

        return html;
    }, '');
}

function getHTMLButtons() {
    return `
            <img src="img/Actions.png" class="actions">
            <img src="img/Heart.png" class="heart">   
    `
}
