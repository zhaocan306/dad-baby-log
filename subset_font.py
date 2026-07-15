from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont
import os

font_path = "static/fonts/ZenMaruGothic-Regular.ttf"
output_dir = "static/fonts"

# 应用中使用的所有文字
chars = (
    "小鲸鱼的一天来到这个世界29天啦总奶量520毫升睡眠65小时下次小睡1430"
    "便便身高5cm体重41kg本周80g乙肝第2针还剩带接种本"
    "首页趋势添加健康消息记录"
    "年月日时分秒0123456789.:·+%()cmkgh"
)

# 去重
chars = "".join(dict.fromkeys(chars))

print(f"Total unique characters: {len(chars)}")
print(f"Characters: {chars}")

opts = Options()
opts.layout_features = ['*']
opts.name_IDs = ['*']
opts.notdef_outline = True
opts.recalc_bounds = True
opts.recalc_timestamp = False

font = TTFont(font_path)
subsetter = Subsetter(options=opts)
subsetter.populate(unicodes=[ord(c) for c in chars])
subsetter.subset(font)

# 输出 TTF
ttf_out = os.path.join(output_dir, "ZenMaruGothic-Regular-subset.ttf")
font.save(ttf_out)
ttf_size = os.path.getsize(ttf_out)
print(f"TTF: {ttf_out} ({ttf_size / 1024:.1f} KB)")

# 输出 WOFF2
woff2_out = os.path.join(output_dir, "ZenMaruGothic-Regular-subset.woff2")
font.flavor = 'woff2'
font.save(woff2_out)
woff2_size = os.path.getsize(woff2_out)
print(f"WOFF2: {woff2_out} ({woff2_size / 1024:.1f} KB)")

font.close()

original_size = os.path.getsize(font_path)
print(f"\nOriginal TTF: {original_size / 1024:.1f} KB")
print(f"TTF reduction: {(1 - ttf_size/original_size) * 100:.1f}%")
print(f"WOFF2 reduction: {(1 - woff2_size/original_size) * 100:.1f}%")
