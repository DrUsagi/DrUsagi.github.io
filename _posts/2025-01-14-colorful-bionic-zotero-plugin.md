---
title: "Colorful Bionic: A Zotero Plugin for Enhanced Reading Experience, Especially for ADHD Readers"
date: 2025-01-14
categories:
  - Tools
  - Research
tags:
  - Zotero
  - ADHD
  - Reading
  - Productivity
  - Open Source
---

I'm excited to introduce [**Colorful Bionic**](https://github.com/DrUsagi/Colorful-Bionic), a Zotero plugin I developed that implements a colorful bionic reading experience in the Zotero reader. This plugin is particularly helpful for individuals with ADHD, as it can significantly improve reading speed and focus when reading academic papers.

## What is Colorful Bionic?

Colorful Bionic is a Zotero plugin that highlights verbs, nouns, and conjunctions in different colors to enhance reading comprehension. It combines the principles of bionic reading with part-of-speech highlighting to create a more engaging and accessible reading experience.

### What is Bionic Reading?

Bionic Reading is a reading method designed to make it easier and faster to comprehend text by guiding the reader's eyes through bolded initial letters of words. This technique emphasizes the beginning of each word, allowing the brain to "fill in" the rest of the word and phrase intuitively, leveraging cognitive shortcuts.

**A**s **sho**wn **i**n **th**is **sent**ence, **t**he **bol**ded **init**ial **lett**ers **o**f **ea**ch **wo**rd **a**re **us**ed **t**o **gui**de **t**he **read**er's **ey**es **thro**ugh **t**he **te**xt, **mak**ing **i**t **eas**ier **t**o **compr**ehend.

### Why This Matters for ADHD Readers

As someone with severe ADHD, I found that traditional reading methods often made it difficult to maintain focus and comprehension when reading dense academic papers. The combination of bionic reading and color-coded part-of-speech highlighting has significantly improved my reading process, making it easier to focus on and comprehend text.

The plugin allows you to:
- Highlight **verbs** in one color (which serve as important memory anchors)
- Highlight **nouns** in another color
- Highlight **conjunctions** to help identify paragraph structure
- Use **bionic reading** to guide your eyes through the text

## Technical Implementation and Limitations

This plugin uses the **compromise** package for part-of-speech recognition. Due to the limitations of this package, which doesn't support syntactic parsing of grammatical structures, it may not accurately identify various gerunds, verb transformations, etc. 

While other larger NLP packages might offer better parsing accuracy, they are constrained by Zotero's extension installation environment. For example, Stanford's Stanza package would require mounting a server on the system, making it complex to install and call from Zotero, and it would process PDFs much more slowly.

I have also experimented with Wink NLP, but found that its parsing results were not significantly different from compromise. Consequently, this package's verb recognition is not perfectly accurate and may include some omissions or incorrect annotations. However, the verbs that are highlighted still generally provide important information. I believe they remain crucial parts of sentences, and readers should be able to understand entire sentences by focusing primarily on these highlighted verbs.

## Installation

1. Download the plugin (.xpi file) from the [GitHub releases page](https://github.com/DrUsagi/Colorful-Bionic/releases)
   - [Latest Stable Release](https://github.com/DrUsagi/Colorful-Bionic/releases/latest)
   - [All Releases](https://github.com/DrUsagi/Colorful-Bionic/releases)
   
   *Note*: If you're using Firefox as your browser, right-click the `.xpi` and select "Save As.."

2. In Zotero, click `Tools` in the top menu bar and then click `Plugins`

3. Go to the Extensions page and then click the gear icon in the top right

4. Select `Install Add-on from file`

5. Browse to where you downloaded the `.xpi` file and select it

6. Finish!

## Quick Start

1. Open a PDF in the Zotero reader
2. The PDF will be displayed in bionic reading mode by default
3. To toggle bionic reading mode and other features, use the `Bio` menu in the top menu bar or the BIO button in the toolbar
4. You can highlight verbs and nouns in different colors to enhance comprehension

## Personal Usage Recommendations

Based on my personal experience, I recommend:
- Enabling black Bionic text and verb highlighting
- Using verbs as memory anchors in sentences can significantly improve reading speed for individuals with ADHD
- Highlighting only verbs keeps the text clean and less visually overwhelming
- Setting nouns to gray color can further emphasize the distinction between nouns and verbs
- Enabling conjunction highlighting can also enhance the reading experience, as longer yellow-highlighted conjunctions (such as "however", "in addition", etc.) often serve as important markers that help you understand paragraph structure and content flow

## Features

### v1.1 (Latest Release)

**New Features and Improvements:**
- **Enhanced UI**: Redesigned BIO button display to show active features with their respective colors (V for verbs, N for nouns, C for conjunctions, P for punctuation)
- **Color Memory**: Colors are now saved per document, allowing different PDFs to have custom color settings
- **Improved Menu Positioning**: Menu now appears to the left of the BIO button to avoid overlapping with the sidebar
- **Punctuation Enhancement**: Added bold punctuation feature with size adjustment and color highlighting, making it easier to identify sentence boundaries
- **Expanded Color Options**: More color choices are now available for each part of speech highlighting
- **Sentence Boundary Recognition**: Enhanced comma and period highlighting helps readers better identify sentence structures and boundaries
- **State Persistence**: All settings are now properly saved and restored per document
- **Visual Indicator**: BIO button now shows status indicators with appropriate styling based on active features

## Why Bionic Reading Works/Doesn't Work?

The effectiveness of Bionic Reading is a subject of ongoing debate, largely because it depends on individual differences in reading habits, cognitive processing, and preferences. While research is still evolving, many users (especially those with ADHD) report significant improvements in reading speed and comprehension.

Want to know more? Check out the latest research on [Google Scholar](https://scholar.google.com/scholar?q=bionic+reading).

## Development

This plugin is built based on the [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template). 

To contribute or build from source:

```bash
git clone https://github.com/DrUsagi/Colorful-Bionic.git
cd Colorful-Bionic
npm install
npm run build
```

The plugin is built to `./builds/*.xpi`.

## Open Source

Colorful Bionic is released under the **AGPL-3.0 license** and is available on [GitHub](https://github.com/DrUsagi/Colorful-Bionic). Contributions, issues, and pull requests are welcome!

## Acknowledgements

Colorful Bionic is a modified version based on the [Bionic for Zotero](https://github.com/windingwind/zotero-bionic-reading) plugin developed by [windingwind](https://github.com/windingwind). Special thanks to windingwind for his contribution and pioneering work, which made this enhanced version possible. While the original plugin provides basic Bionic reading functionality, this version adds features like colorful part-of-speech highlighting.

## Try It Out!

If you're a researcher, student, or anyone who reads academic papers and struggles with focus or reading speed, I encourage you to try Colorful Bionic. It's particularly helpful if you have ADHD or other attention-related challenges. The plugin is free, open-source, and actively maintained.

Visit the [GitHub repository](https://github.com/DrUsagi/Colorful-Bionic) to download, install, and start improving your reading experience today!

---

*Have questions or feedback? Feel free to open an issue on [GitHub](https://github.com/DrUsagi/Colorful-Bionic/issues) or reach out!*

