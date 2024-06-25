export function checkUpl(e, setAtt) {
    const file = e.target.files[0]
    if (!file) return
    const fileSizeLimit = 10 * 1024 * 1024
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
    if (file.size > fileSizeLimit) {
        throw new Error('Max allowed file size is ' + fileSizeLimit / 1024 / 1024 + 'MB')
    }
    const { name: fileName } = file;
    const fileExtension = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2)
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        throw new Error('Only images or gifs are allowed (' + allowedExtensions.join(', ') + ')')
    }

    const reader = new FileReader()
    reader.onload = () => {
        const b64 = reader.result.split(',')[1]
        setAtt(b64)
    }
    reader.readAsDataURL(file)
}

export function parseTextToPMD(textFrom) { // PMD = provoda markdown
    const parseDict = [ // Basic markdown rules
        {
            parseFind: /\*\*/g,
            parseFrom: "**",
            parseToS: "<strong>",
            parseToE: "</strong>",
        },
        {
            parseFind: /\*/g,
            parseFrom: "*",
            parseToS: "<i>",
            parseToE: "</i>",
        },
        {
            parseFind: /__/g,
            parseFrom: "__",
            parseToS: "<ins>",
            parseToE: "</ins>",
        },
        {
            parseFind: /~~/g,
            parseFrom: "~~",
            parseToS: "<del>",
            parseToE: "</del>",
        },
    ]

    let text = textFrom
    // console.log("PF = " + textFrom)

    text = text.replace(/(?<!<(strong|i|ins|del)>)\</g, '&lt;') // Protect from random html tags
        .replace(/(?<!<(strong|i|ins|del)>)</g, '&lt;')
        .replace(/\>(?!<\/(strong|i|ins|del)>\))/g, '&gt;')
        .replace(/\>(?!<\/(strong|i|ins|del)>)/g, '&gt;')

    parseDict.forEach(parseRule => {
        const occurArray = (text.match(parseRule.parseFind) || [])
        // console.log(occurArray.length)
        for (let i = occurArray.length; i >= 2; i = i - 2) {
            text = text.replace(parseRule.parseFrom, parseRule.parseToS)
            text = text.replace(parseRule.parseFrom, parseRule.parseToE)
        }
    })

    text = text.replace(/#([\wа-яё]+)/g, '<span style="color:#b09fce; cursor:pointer;" onClick="window.location=`/c/$1`">$&</span>')
    text = text.replace(/@([\wа-яё]+)/g, '<span style="color:#b09fce; cursor:pointer;" onClick="window.location=`/u/$1`">$&</span>')
    
    // console.log("PE = " + text)
    return text
}
