"use strict";

const spread = s => [...s];
const normalUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const normalLower = "abcdefghijklmnopqrstuvwxyz";

function isArLetter(c) {
    const cp = c.codePointAt(0);
    return (cp >= 0x0600 && cp <= 0x06FF) || (cp >= 0xFE70 && cp <= 0xFEFF);
}
const NO_EXT = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و', 'ء', 'أ', 'إ', 'آ', 'ؤ']);

// ─── Helper: apply a combining char after every letter ───
const combine = (text, mark) => [...text].map(c => /[a-zA-Z]/.test(c) ? c + mark : c).join('');
// Upside-down map
const upsideDownU = spread("∀𐐒ƆᗡƎℲ⅁HIſʞ˥WNOԀΌᴚS⊥∩ΛWX⅄Z");
const upsideDownL = spread("ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz");
// Superscript
const supL = spread("ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ");
const supU = spread("ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᵠᴿˢᵀᵁᵛᵂˣʸᶻ");

// ─── 50+ English Styles ───────────────────────────────
const stylesEN = [
    // ── BASIC ──
    { cat: "أساسي", name: "Bold 𝐁", U: spread("𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙"), L: spread("𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳") },
    { cat: "أساسي", name: "Italic 𝐼", U: spread("𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍"), L: spread("𝑎𝑏𝑐𝑑𝑒𝑓𝑔𝑕𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧") },
    { cat: "أساسي", name: "Bold Italic 𝑩", U: spread("𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁"), L: spread("𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛") },
    { cat: "أساسي", name: "Sans-Serif 𝖠", U: spread("𝖠𝖡𝖢𝖣𝖤𝖥𝖦𝖧𝖨𝖩𝖪𝖫𝖬𝖭𝖮𝖯𝖰𝖱𝖲𝖳𝖴𝖵𝖶𝖷𝖸𝖹"), L: spread("𝖺𝖻𝖼𝖽𝖾𝖿𝗀𝗁𝗂𝗃𝗄𝗅𝗆𝗇𝗈𝗉𝗊𝗋𝗌𝗍𝗎𝗏𝗐𝗑𝗒𝗓") },
    { cat: "أساسي", name: "Sans Bold 𝗔", U: spread("𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭"), L: spread("𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇") },
    { cat: "أساسي", name: "Sans Italic 𝘈", U: spread("𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡"), L: spread("𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻") },
    { cat: "أساسي", name: "Monospace 𝙼", U: spread("𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉"), L: spread("𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣") },
    { cat: "أساسي", name: "Small Caps ᴀʙᴄ", U: spread("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), L: spread("ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ") },
    { cat: "أساسي", name: "Wide Text Ａ", U: spread("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"), L: spread("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ") },

    // ── FANCY ──
    { cat: "فانسي", name: "Script 𝒜", U: spread("𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"), L: spread("𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏") },
    { cat: "فانسي", name: "Bold Script 𝓐", U: spread("𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"), L: spread("𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃") },
    { cat: "فانسي", name: "Fraktur 𝔄", U: spread("𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"), L: spread("𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷") },
    { cat: "فانسي", name: "Bold Fraktur 𝕬", U: spread("𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"), L: spread("𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟") },
    { cat: "فانسي", name: "Double Struck 𝔸", U: spread("𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ"), L: spread("𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫") },
    { cat: "فانسي", name: "Circled Ⓐ", U: spread("ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ"), L: spread("ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ") },
    { cat: "فانسي", name: "Neg Circled 🅐", U: spread("🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"), L: spread("🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩") },
    { cat: "فانسي", name: "Squared 🄰", U: spread("🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉"), L: spread("🄰🄱🄲🄳🄴🄵🄶🄷🄸🄹🄺🄻🄼🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉") },
    { cat: "فانسي", name: "Neg Squared 🅰", U: spread("🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉"), L: spread("🅰🅱🅲🅳🅴🅵🅶🅷🅸🅹🅺🅻🅼🅽🅾🅿🆀🆁🆂🆃🆄🆅🆆🆇🆈🆉") },
    { cat: "فانسي", name: "Bubble Text ⓑ", U: spread("ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ"), L: spread("ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ") },
    { cat: "فانسي", name: "Parenthesized ⒜", U: spread("⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵"), L: spread("⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⒴⒵") },
    { cat: "فانسي", name: "Superscript ᵃᵇᶜ", U: supU, L: supL },
    {
        cat: "فانسي", name: "Upside Down ↙",
        fn: t => [...t].reverse().map(c => {
            const u = normalUpper.indexOf(c), l = normalLower.indexOf(c);
            if (u !== -1) return upsideDownU[u] || c;
            if (l !== -1) return upsideDownL[l] || c;
            return c;
        }).join('')
    },

    // ── COMBINING / EFFECTS ──
    { cat: "تأثيرات", name: "Strike Through ̶", fn: t => combine(t, '\u0336') },
    { cat: "تأثيرات", name: "Underline ̲", fn: t => combine(t, '\u0332') },
    { cat: "تأثيرات", name: "Double Underline ̳", fn: t => combine(t, '\u0333') },
    { cat: "تأثيرات", name: "Slashed Text ̸", fn: t => combine(t, '\u0338') },
    { cat: "تأثيرات", name: "Overline ̄", fn: t => combine(t, '\u0304') },
    { cat: "تأثيرات", name: "Tilde Over ̃", fn: t => combine(t, '\u0303') },
    { cat: "تأثيرات", name: "Dots Above ̈", fn: t => combine(t, '\u0308') },
    { cat: "تأثيرات", name: "Circle Above ̊", fn: t => combine(t, '\u030A') },
    { cat: "تأثيرات", name: "Dot Below ̣", fn: t => combine(t, '\u0323') },
    { cat: "تأثيرات", name: "Strike + Underline", fn: t => combine(t, '\u0336\u0332') },

    // ── SPECIAL ──
    {
        cat: "خاص", name: "Vaporwave ｖａｐｏｒ",
        fn: t => [...t].map(c => {
            const u = normalUpper.indexOf(c.toUpperCase());
            if (u !== -1) return "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"[u];
            return c === ' ' ? '　' : c;
        }).join('')
    },
    {
        cat: "خاص", name: "Zalgo Glitch 𝔷",
        fn: t => {
            const above = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u030b', '\u030c', '\u030a', '\u0308', '\u030e'];
            const below = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324'];
            return [...t].map(c => {
                if (!/[a-zA-Z]/.test(c)) return c;
                let r = c;
                for (let i = 0; i < 3; i++) r += above[Math.floor(Math.random() * above.length)];
                for (let i = 0; i < 2; i++) r += below[Math.floor(Math.random() * below.length)];
                return r;
            }).join('');
        }
    },
    {
        cat: "خاص", name: "Glitch Style g̷l̷i̷t̷c̷h̷",
        fn: t => [...t].map(c => /[a-zA-Z]/.test(c) ? c + '\u0337' + '\u0308' : c).join('')
    },
    {
        cat: "خاص", name: "Hacker Style H4CK3R",
        fn: t => [...t].map(c => ({ A: '4', a: '4', E: '3', e: '3', I: '1', i: '1', O: '0', o: '0', S: '5', s: '5', T: '7', t: '7', G: '9', g: '9', B: '8', b: '8' }[c] || c)).join('')
    },
    {
        cat: "خاص", name: "Neon Style 🌟",
        fn: t => [...t].map(c => /[a-zA-Z]/.test(c) ? c + '\u0353' : c).join('')
    },
    {
        cat: "خاص", name: "Medieval Style 𝔐",
        U: spread("𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ"),
        L: spread("𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷")
    },
    {
        cat: "خاص", name: "Aesthetic Style ａｅｓ",
        U: spread("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ"),
        L: spread("ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ")
    },
    {
        cat: "خاص", name: "Cute Style ♡ c̈ü̈ẗë̈",
        fn: t => [...t].map(c => /[a-zA-Z]/.test(c) ? c + '\u0308' : c).join('')
    },
    {
        cat: "خاص", name: "Elegant Style 𝓔",
        U: spread("𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"),
        L: spread("𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃")
    },
    {
        cat: "خاص", name: "Royal Style 𝕽",
        U: spread("𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"),
        L: spread("𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟")
    },
    {
        cat: "خاص", name: "Minimal Style ᴍɪɴ",
        U: spread("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
        L: spread("ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ")
    },

    // ── WRAPPERS / DECORATED ──
    { cat: "ديكور", name: "🌟 Sparkle", wrap: "✨ {} ✨" },
    { cat: "ديكور", name: "⭐ Stars", wrap: "★·.·´¯`·.·★ {} ★·.·´¯`·.·★" },
    { cat: "ديكور", name: "♥ Heart", wrap: "♥♡♥ {} ♥♡♥" },
    { cat: "ديكور", name: "👑 Crown", wrap: "👑 {} 👑" },
    { cat: "ديكور", name: "🌸 Flower", wrap: "❀.•°• {} •°•.❀" },
    { cat: "ديكور", name: "🌊 Wave", wrap: "≋ {} ≋" },
    { cat: "ديكور", name: "🎀 Ribbon", wrap: "🎀 {} 🎀" },
    { cat: "ديكور", name: "🔥 Fire", wrap: "🔥 {} 🔥" },
    { cat: "ديكور", name: "💎 Diamond", wrap: "💎 {} 💎" },
    { cat: "ديكور", name: "⚡ Lightning", wrap: "⚡ {} ⚡" },
    { cat: "ديكور", name: "🦋 Butterfly", wrap: "🦋 {} 🦋" },
    { cat: "ديكور", name: "🌙 Moon", wrap: "🌙·͜·  {} ·͜·🌙" },
    { cat: "ديكور", name: "♔ Royal", wrap: "♔♕♖ {} ♜♛♚" },
    { cat: "ديكور", name: "⚔️ Swords", wrap: "⚔️ {} ⚔️" },
    { cat: "ديكور", name: "︻デ═一 Sniper", wrap: "︻デ═一 {} ︻デ═一" },
    { cat: "ديكور", name: "ψ Demon", wrap: "ψ(._. )> {} <( ._.)ψ" },
    { cat: "ديكور", name: "♫ Music", wrap: "♫♪|●=●|♪♫ {} ♫♪|●=●|♪♫" },
    { cat: "ديكور", name: "→ Arrow", wrap: "→ {} ←" },
    { cat: "ديكور", name: "【】 Brackets", wrap: "【 {} 】" },
    { cat: "ديكور", name: "『』 Japanese", wrap: "『 {} 』" },
];

// ─── Arabic Unicode Styles ────────────────────────
const AR_BASE = spread("ابتثجحخدذرزسشصضطظعغفقكلمنهوي");
const AR_MAP1 = spread("ٱٻٺٽڄځڿڈڎڙڛڜڝڞطظ؏ڠڡڦڪڸمڼۿوۍ");
const AR_MAP2 = spread("ٵڀٺٽڄڃڿڍڎڑڗڛۺڝڞﻁﻅ؏ۼڡڨکﻟﻡﻧﻩﻭۍ");
const AR_NODOT = spread("اٮٮٮحححددررسسصصططعع٢ٯكلمنهوى");
const AR_PRES = spread("ﭐﺑﺗﺛﺟﺣﺧﺩﺫﺭﺯﺱﺵﺹﺽﻁﻅﻋﻏﻓﻗﻙﻟﻣﻥﻫﻭﻱ");

const stylesAR_unicode = [
    // ── حروف مزخرفة ──
    { cat: "خطوط", name: "زخرفة عربية 1", ar: AR_BASE, dec: AR_MAP1 },
    { cat: "خطوط", name: "زخرفة عربية 2", ar: AR_BASE, dec: AR_MAP2 },
    { cat: "خطوط", name: "بدون نقاط", ar: AR_BASE, dec: AR_NODOT },
    { cat: "خطوط", name: "حروف مزدوجة", ar: AR_BASE, dec: AR_PRES },

    // ── تشكيل (زبر / زير / پيش) ──
    { cat: "تشكيل", name: "زَبَر (فتحة)", fn: t => [...t].map(c => isArLetter(c) ? c + '\u064E' : c).join('') },
    { cat: "تشكيل", name: "زِير (كسرة)", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0650' : c).join('') },
    { cat: "تشكيل", name: "پَيش (ضمة)", fn: t => [...t].map(c => isArLetter(c) ? c + '\u064F' : c).join('') },
    { cat: "تشكيل", name: "تنوين فتح ً", fn: t => [...t].map(c => isArLetter(c) ? c + '\u064B' : c).join('') },
    { cat: "تشكيل", name: "تنوين ضم ٌ", fn: t => [...t].map(c => isArLetter(c) ? c + '\u064C' : c).join('') },
    { cat: "تشكيل", name: "تنوين كسر ٍ", fn: t => [...t].map(c => isArLetter(c) ? c + '\u064D' : c).join('') },
    { cat: "تشكيل", name: "شدّة كاملة ّ", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0651' : c).join('') },
    { cat: "تشكيل", name: "شدّة + زَبَر", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0651\u064E' : c).join('') },
    { cat: "تشكيل", name: "شدّة + زِير", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0651\u0650' : c).join('') },
    { cat: "تشكيل", name: "شدّة + پَيش", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0651\u064F' : c).join('') },
    { cat: "تشكيل", name: "سُكون ْ", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0652' : c).join('') },
    { cat: "تشكيل", name: "تشكيل عشوائي 🎲", fn: t => { const h = ['\u064E', '\u064B', '\u064F', '\u064C', '\u0650', '\u064D', '\u0652', '\u0651', '\u0651\u064E', '\u0651\u0650']; return [...t].map(c => isArLetter(c) ? c + h[Math.floor(Math.random() * h.length)] : c).join(''); } },

    // ── كشيدة (تمديد) ──
    { cat: "كشيدة", name: "كشيدة ـ", fn: t => { const a = [...t]; return a.map((c, i) => isArLetter(c) && !NO_EXT.has(c) && i < a.length - 1 ? c + '\u0640' : c).join(''); } },
    { cat: "كشيدة", name: "كشيدة مزدوجة ـ ـ", fn: t => { const a = [...t]; return a.map((c, i) => isArLetter(c) && !NO_EXT.has(c) && i < a.length - 1 ? c + '\u0640\u0640' : c).join(''); } },
    { cat: "كشيدة", name: "كشيدة ثلاثية ـ ـ ـ", fn: t => { const a = [...t]; return a.map((c, i) => isArLetter(c) && !NO_EXT.has(c) && i < a.length - 1 ? c + '\u0640\u0640\u0640' : c).join(''); } },
    { cat: "كشيدة", name: "فتحة + كشيدة", fn: t => { const a = [...t]; return a.map((c, i) => { if (!isArLetter(c)) return c; const e = !NO_EXT.has(c) && i < a.length - 1 ? '\u0640' : ''; return c + '\u064E' + e; }).join(''); } },
    { cat: "كشيدة", name: "ضمة + كشيدة", fn: t => { const a = [...t]; return a.map((c, i) => { if (!isArLetter(c)) return c; const e = !NO_EXT.has(c) && i < a.length - 1 ? '\u0640' : ''; return c + '\u064F' + e; }).join(''); } },
    { cat: "كشيدة", name: "تشكيل + مدّ 🌟", fn: t => { const h = ['\u064E', '\u064F', '\u0650', '\u0651', '\u0652']; const a = [...t]; return a.map((c, i) => { if (!isArLetter(c)) return c; const r = h[Math.floor(Math.random() * h.length)]; const e = !NO_EXT.has(c) && i < a.length - 1 ? '\u0640' : ''; return c + r + e; }).join(''); } },

    // ── تأثيرات خاصة ──
    { cat: "تأثيرات", name: "م͠ح͠م͠ تيلدة فوق", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0360' : c).join('') },
    { cat: "تأثيرات", name: "م̷ح̷م̷ خط مائل", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0337' : c).join('') },
    { cat: "تأثيرات", name: "م̲ح̲م̲ خط تحت", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0332' : c).join('') },
    { cat: "تأثيرات", name: "م̈ح̈م̈ نقطتان فوق", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0308' : c).join('') },
    { cat: "تأثيرات", name: "م̊ح̊م̊ دائرة فوق", fn: t => [...t].map(c => isArLetter(c) ? c + '\u030A' : c).join('') },
    { cat: "تأثيرات", name: "م̃ح̃م̃ تيلدة تحت", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0303' : c).join('') },
    { cat: "تأثيرات", name: "م̣ح̣م̣ نقطة تحت", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0323' : c).join('') },
    { cat: "تأثيرات", name: "م̄ح̄م̄ خط فوق", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0304' : c).join('') },
    { cat: "تأثيرات", name: "م͆ح͆م͆ نجمة فوق", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0346' : c).join('') },
    { cat: "تأثيرات", name: "مـحـمـد فراغ بين الحروف", fn: t => { const a = [...t]; return a.map((c, i) => isArLetter(c) && i < a.length - 1 ? c + '\u0640' : c).join(''); } },
    { cat: "تأثيرات", name: "مقلوب ↩", fn: t => [...t].reverse().join('') },
    { cat: "تأثيرات", name: "زخرفة ثقيلة ✦", fn: t => { const a = [...t]; return a.map((c, i) => { if (!isArLetter(c)) return c; const e = !NO_EXT.has(c) && i < a.length - 1 ? '\u0640' : ''; return c + '\u064E\u0323' + e; }).join(''); } },
    { cat: "تأثيرات", name: "زخرفة مرعبة 💀", fn: t => [...t].map(c => isArLetter(c) ? c + '\u0332\u0337' : c).join('') },

    // ── ديكور ──
    { cat: "ديكور", name: "🎀 شريطة", wrap: "🎀 {} 🎀" },
    { cat: "ديكور", name: "★ نجوم", wrap: "★·.·´¯`·.·★ {} ★·.·´¯`·.·★" },
    { cat: "ديكور", name: "♥ قلوب", wrap: "♥♡♥ {} ♥♡♥" },
    { cat: "ديكور", name: "♔ ملكي", wrap: "♔♕♖ {} ♜♛♚" },
    { cat: "ديكور", name: "❀ زهور", wrap: "❀.•°•.★.•°•.❀ {} ❀.•°•.★.•°•.❀" },
    { cat: "ديكور", name: "≋ مموج", wrap: "≋{}≋" },
    { cat: "ديكور", name: "ψ شيطان", wrap: "ψ(._. )> {} <( ._.)ψ" },
    { cat: "ديكور", name: "︻ أسلحة", wrap: "︻デ═一 {} ︻デ═一" },
    { cat: "ديكور", name: "♫ موسيقى", wrap: "♫♪|●=●|♪♫ {} ♫♪|●=●|♪♫" },
    { cat: "ديكور", name: "🔥 نار", wrap: "🔥 {} 🔥" },
    { cat: "ديكور", name: "💎 ألماس", wrap: "💎 {} 💎" },
    { cat: "ديكور", name: "👑 تاج", wrap: "👑 {} 👑" },
    { cat: "ديكور", name: "✨ لمعان", wrap: "✨ {} ✨" },
    { cat: "ديكور", name: "🌙 قمر", wrap: "🌙 {} 🌙" },
    { cat: "ديكور", name: "⚡ برق", wrap: "⚡ {} ⚡" },
];

// ─── Arabic Visual Font Styles (Google Fonts) ────
const stylesAR_visual = [
    { name: "Amiri — نسخ كلاسيكي", fontClass: "vf-Amiri", label: "Naskh" },
    { name: "Scheherazade — شهرزاد", fontClass: "vf-Scheherazade", label: "Classic" },
    { name: "Noto Naskh Arabic", fontClass: "vf-NotoNaskh", label: "Naskh" },
    { name: "Noto Kufi Arabic", fontClass: "vf-NotoKufi", label: "Kufi" },
    { name: "Reem Kufi — كوفي زخرفي", fontClass: "vf-ReemKufi", label: "Kufi" },
    { name: "Rakkas — كوفي بارز", fontClass: "vf-Rakkas", label: "Diwani" },
    { name: "Katibeh — نسخ قديم", fontClass: "vf-Katibeh", label: "Old Naskh" },
    { name: "Aref Ruqaa — رقعة", fontClass: "vf-ArefRuqaa", label: "Ruqaa" },
    { name: "Mirza — نستعليق", fontClass: "vf-Mirza", label: "Nastaliq" },
    { name: "Lateef — نسخ رقيق", fontClass: "vf-Lateef", label: "Naskh" },
    { name: "Markazi Text — ثلث حديث", fontClass: "vf-MarkaziText", label: "Thuluth" },
    { name: "El Messiri — معاصر", fontClass: "vf-ElMessiri", label: "Modern" },
    { name: "Tajawal — تجوال", fontClass: "vf-Tajawal", label: "Modern" },
    { name: "Almarai — المراي", fontClass: "vf-Almarai", label: "Modern" },
    { name: "Mada — مدى", fontClass: "vf-Mada", label: "Modern" },
    { name: "Cairo — القاهرة", fontClass: "vf-Cairo", label: "Modern" },
    { name: "Lemonada — مدوّر", fontClass: "vf-Lemonada", label: "Rounded" },
    { name: "Baloo Bhaijaan 2", fontClass: "vf-Baloo", label: "Rounded" },
];

// ─── Decoration Engines ───────────────────────────
function decorateEN(text, style) {
    if (style.wrap) return style.wrap.replace("{}", text);
    if (style.fn) return style.fn(text);
    return [...text].map(c => {
        const u = normalUpper.indexOf(c), l = normalLower.indexOf(c);
        if (u !== -1) return style.U[u] || c;
        if (l !== -1) return style.L[l] || c;
        return c;
    }).join('');
}

function decorateAR_unicode(text, style) {
    if (style.wrap) return style.wrap.replace("{}", text);
    if (style.fn) return style.fn(text);
    return [...text].map(c => {
        const idx = style.ar ? style.ar.indexOf(c) : -1;
        return (idx !== -1 && style.dec[idx]) ? style.dec[idx] : c;
    }).join('');
}

// ─── State ────────────────────────────────────────
let activeLang = 'ar';
let activeColor = '#FFFFFF';

// ─── DOM ─────────────────────────────────────────
const textInput = document.getElementById('textInput');
const clearBtn = document.getElementById('clearBtn');
const resultsGrid = document.getElementById('resultsGrid');
const emptyState = document.getElementById('emptyState');
const toastCont = document.getElementById('toast-container');
const tabAr = document.getElementById('tabAr');
const tabEn = document.getElementById('tabEn');
const swatches = document.querySelectorAll('.swatch');
const customColor = document.getElementById('customColor');

// ─── Language Toggle ──────────────────────────────
function setLang(lang) {
    activeLang = lang;
    if (lang === 'ar') {
        tabAr.classList.add('active'); tabEn.classList.remove('active');
        textInput.placeholder = 'اكتب اسمك أو نصك بالعربي هنا...';
        textInput.setAttribute('dir', 'rtl');
    } else {
        tabEn.classList.add('active'); tabAr.classList.remove('active');
        textInput.placeholder = 'Type your name or text in English here...';
        textInput.setAttribute('dir', 'ltr');
    }
    renderResults(textInput.value);
}
tabAr.addEventListener('click', () => setLang('ar'));
tabEn.addEventListener('click', () => setLang('en'));

// ─── Color Picker ─────────────────────────────────
function setColor(color) {
    activeColor = color;
    document.querySelectorAll('.style-content').forEach(el => el.style.color = activeColor);
}
swatches.forEach(sw => {
    if (sw.dataset.color) sw.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active-swatch'));
        sw.classList.add('active-swatch');
        setColor(sw.dataset.color);
    });
});
customColor.addEventListener('input', e => {
    swatches.forEach(s => s.classList.remove('active-swatch'));
    setColor(e.target.value);
});

// ─── Card Builder ─────────────────────────────────
function makeCard(name, generated, dir, extraClass, fontClass, badge, delay) {
    const card = document.createElement('div');
    card.className = 'style-card' + (extraClass ? ' ' + extraClass : '');
    card.style.animationDelay = `${delay}ms`;
    const cls = dir === 'rtl' ? 'style-content arabic' : 'style-content';
    const fc = fontClass ? ' ' + fontClass : '';
    const bh = badge ? `<span class="visual-badge">${badge}</span><br>` : '';
    card.innerHTML = `<div style="min-width:0;flex:1">${bh}<div class="style-name">${name}</div><div class="${cls}${fc}" dir="${dir}" style="color:${activeColor}">${generated}</div></div><button class="copy-btn"><i class="fa-solid fa-copy"></i></button>`;
    card.addEventListener('click', () => copyText(generated, card));
    return card;
}

function makeDivider(label, sectionClass) {
    const d = document.createElement('div');
    d.className = `section-divider ${sectionClass}`;
    d.innerHTML = `<span>${label}</span>`;
    return d;
}

// ─── Category divider for English ────────────────
function makeCatDivider(label) {
    const d = document.createElement('div');
    d.className = 'section-divider unicode-sec';
    d.innerHTML = `<span>${label}</span>`;
    return d;
}

// ─── Render ───────────────────────────────────────
function renderResults(val) {
    if (!val.trim()) {
        clearBtn.classList.remove('visible');
        emptyState.classList.remove('hidden');
        resultsGrid.classList.remove('active');
        resultsGrid.innerHTML = '';
        return;
    }
    clearBtn.classList.add('visible');
    emptyState.classList.add('hidden');
    resultsGrid.classList.add('active');
    resultsGrid.innerHTML = '';

    if (activeLang === 'en') {
        const categories = ['أساسي', 'فانسي', 'تأثيرات', 'خاص', 'ديكور'];
        const catLabels = { 'أساسي': '✦ Basic Styles', 'فانسي': '✦ Fancy Unicode', 'تأثيرات': '✦ Text Effects', 'خاص': '✦ Special Styles', 'ديكور': '✦ Decorated' };
        let idx = 0;
        categories.forEach(cat => {
            const group = stylesEN.filter(s => s.cat === cat);
            if (!group.length) return;
            resultsGrid.appendChild(makeCatDivider(catLabels[cat]));
            group.forEach(style => {
                const generated = decorateEN(val, style);
                resultsGrid.appendChild(makeCard(style.name, generated, 'ltr', '', '', '', idx++ * 18));
            });
        });
    } else {
        // ── Arabic categories ──
        const arCats = ['خطوط', 'تشكيل', 'كشيدة', 'تأثيرات', 'ديكور'];
        const arCatLabels = {
            'خطوط': '✦ خطوط مزخرفة — Decorated Letters',
            'تشكيل': '✦ تشكيل — Harakat (زبر / زير / پيش)',
            'كشيدة': '✦ كشيدة — Tatweel Extensions',
            'تأثيرات': '✦ تأثيرات خاصة — Special Effects',
            'ديكور': '✦ ديكور — Decorative Wrappers',
        };

        let arIdx = 0;
        arCats.forEach(cat => {
            const group = stylesAR_unicode.filter(s => s.cat === cat);
            if (!group.length) return;
            resultsGrid.appendChild(makeDivider(arCatLabels[cat], 'unicode-sec'));
            group.forEach(style => {
                resultsGrid.appendChild(makeCard(style.name, decorateAR_unicode(val, style), 'rtl', '', '', '', arIdx++ * 16));
            });
        });

        // ── Google Fonts visual section ──
        resultsGrid.appendChild(makeDivider('🖋 معاينة خطوط Google — للمنظر فقط (لا تُنسخ مع الخط)', 'visual-sec'));
        stylesAR_visual.forEach((style, idx) => {
            resultsGrid.appendChild(makeCard(style.name, val, 'rtl', 'visual-card', style.fontClass, style.label, (arIdx + idx) * 16));
        });
    }
}

// ─── Copy ─────────────────────────────────────────
function copyText(text, card) {
    navigator.clipboard.writeText(text).then(() => {
        card.classList.add('copied');
        const icon = card.querySelector('i');
        icon.className = 'fa-solid fa-check';
        setTimeout(() => { card.classList.remove('copied'); icon.className = 'fa-solid fa-copy'; }, 2000);
        showToast('Copied! ✓');
    }).catch(() => showToast('Copy failed'));
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i><span>${msg}</span>`;
    toastCont.appendChild(t);
    setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 450); }, 2800);
}

// ─── Events ───────────────────────────────────────
textInput.addEventListener('input', () => renderResults(textInput.value));
clearBtn.addEventListener('click', () => { textInput.value = ''; textInput.focus(); renderResults(''); });

setLang('ar');
