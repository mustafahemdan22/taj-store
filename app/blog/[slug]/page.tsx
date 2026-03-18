'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../../../contexts/LanguageProvider';
import { FiArrowLeft, FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';
import styles from './BlogPost.module.css';
import { useEffect, useState ,use } from 'react';
// بيانات المقالات
const blogPosts = {
  'smart-shopping': {
    title: {
      ar: 'كيف تنسقين الوشاح مع إطلالتك اليومية',
      en: 'How to Style Your Scarf with Everyday Outfits'
    },
    image: "https://res.cloudinary.com/dfq1xxerr/image/upload/v1772210601/taj-scarf/blog/Black-Crepe-Shayla-Hijab-600x600.jpg",
    author: {
      ar: 'فريق تاج سكارف',
      en: 'Taj Scarf Team'
    },
    date: {
      ar: '١٠ نوفمبر ٢٠٢٥',
      en: 'November 10, 2025'
    },
    content: {
      ar: `
        <h2>فن تنسيق الأوشحة</h2>
        <p>الوشاح ليس مجرد إكسسوار، بل هو قطعة فنية تضيف لمسة من الأناقة والتميز لأي إطلالة. سواء كنتِ في اجتماع عمل أو نزهة مع الأصدقاء، يمكن للوشاح أن يحول مظهرك بالكامل. في هذا المقال، سنشارككِ أفضل الطرق لتنسيق الوشاح.</p>
        
        <h3>١. العقدة الفرنسية الكلاسيكية</h3>
        <p>اطوي الوشاح من المنتصف ثم لفيه حول عنقك. مرري الأطراف الحرة من خلال الحلقة المتكونة. هذه الطريقة مثالية للأجواء الباردة وتعطي مظهراً أنيقاً ومرتباً مع المعطف أو البلايزر.</p>
        
        <h3>٢. التنسيق مع الفستان</h3>
        <p>يمكن استخدام الوشاح الحريري كحزام للخصر حول فستان بسيط لإضافة لمسة لونية مميزة. أو لفيه حول كتفيك كشال خفيف في المساء لإطلالة راقية ودافئة.</p>
        
        <h3>٣. ربطة الرأس العصرية</h3>
        <p>الأوشحة الحريرية مثالية لتزيين الشعر. اطوي الوشاح على شكل مثلث ولفيه حول رأسك كعصبة أو اربطيه على شكل فيونكة لإطلالة عصرية ملفتة.</p>
        
        <h3>٤. التدلي الأنيق</h3>
        <p>ضعي الوشاح ببساطة على كتفيك واتركيه يتدلى بشكل طبيعي. هذه الطريقة تعمل بشكل رائع مع أوشحة الكشمير والباشمينا الطويلة وتضيف بُعداً من الترف واللامبالاة الأنيقة.</p>
        
        <h3>٥. تنسيق الألوان</h3>
        <p>اختاري وشاحاً بألوان مكملة لملابسك. الألوان المحايدة كالأسود والفضي والبيج تناسب كل شيء، بينما الألوان الجريئة تضيف نقطة جذب بصرية رائعة.</p>
        
        <h3>٦. لفة الكيب</h3>
        <p>الأوشحة الكبيرة يمكن استخدامها كبديل للمعطف الخفيف. لفي الوشاح حول كتفيك وثبتيه ببروش أنيق لإطلالة ملكية مميزة تجمع بين الدفء والأناقة.</p>
        
        <p><strong>خلاصة:</strong> الوشاح هو أكثر الإكسسوارات تنوعاً في خزانة ملابسك. بقليل من الإبداع، يمكنك تحويل أي إطلالة بسيطة إلى مظهر أنيق وفاخر!</p>
      `,
      en: `
        <h2>The Art of Scarf Styling</h2>
        <p>A scarf is not just an accessory—it's an artistic piece that adds a touch of elegance and distinction to any outfit. Whether you're at a business meeting or enjoying a day out with friends, a scarf can completely transform your look. In this article, we'll share the best ways to style your scarf.</p>
        
        <h3>1. The Classic French Knot</h3>
        <p>Fold the scarf in half and wrap it around your neck. Thread the loose ends through the loop. This method is perfect for cold weather and gives a polished, sophisticated look paired with a coat or blazer.</p>
        
        <h3>2. Styling with a Dress</h3>
        <p>A silk scarf can be used as a waist belt around a simple dress to add a distinctive color accent. Or drape it over your shoulders as a light shawl in the evening for a refined, warm look.</p>
        
        <h3>3. The Trendy Headband</h3>
        <p>Silk scarves are perfect for hair decoration. Fold the scarf into a triangle and wrap it around your head as a headband, or tie it into a bow for a chic, eye-catching look.</p>
        
        <h3>4. The Elegant Drape</h3>
        <p>Simply place the scarf over your shoulders and let it hang naturally. This works beautifully with long cashmere and pashmina scarves, adding a dimension of luxury and effortless elegance.</p>
        
        <h3>5. Color Coordination</h3>
        <p>Choose a scarf in complementary colors to your outfit. Neutral tones like black, silver, and beige go with everything, while bold colors add a striking visual focal point.</p>
        
        <h3>6. The Cape Wrap</h3>
        <p>Large scarves can serve as a light coat alternative. Wrap the scarf around your shoulders and secure it with an elegant brooch for a regal look that combines warmth with sophistication.</p>
        
        <p><strong>Conclusion:</strong> The scarf is the most versatile accessory in your wardrobe. With a little creativity, you can transform any simple outfit into an elegant, luxurious look!</p>
      `
    }
  },
  'fresh-produce': {
    title: {
      ar: 'دليلك الشامل لأنواع الأقمشة الفاخرة',
      en: 'Your Complete Guide to Luxury Fabrics'
    },
    image: "https://res.cloudinary.com/dfq1xxerr/image/upload/v1772210603/taj-scarf/blog/OIP_10.jpg",
    author: {
      ar: 'نورا حسن',
      en: 'Noura Hassan'
    },
    date: {
      ar: '٩ نوفمبر ٢٠٢٥',
      en: 'November 9, 2025'
    },
    content: {
      ar: `
        <h2>عالم الأقمشة الفاخرة: دليلك الشامل</h2>
        <p>اختيار القماش المناسب هو أساس أي وشاح فاخر. كل نوع من الأقمشة له خصائص فريدة تجعله مناسباً لمناسبات ومواسم مختلفة. في هذا الدليل الشامل، سنتعرف على أهم أنواع الأقمشة المستخدمة في صناعة الأوشحة الفاخرة.</p>
        
        <h3>الكشمير: ملك الأقمشة</h3>
        <p>يُصنع الكشمير من شعر ماعز الكشمير الذي يعيش في المناطق الجبلية الباردة. يتميز بنعومته الاستثنائية، خفة وزنه، وقدرته على العزل الحراري. يعتبر من أغلى الأقمشة وأكثرها فخامة في العالم.</p>
        
        <h3>الحرير: أناقة لا تبلى</h3>
        <p>الحرير هو القماش الأكثر أناقة وبريقاً. يتميز بملمسه الناعم ولمعانه الطبيعي وقدرته على التنفس. مثالي للمناسبات الخاصة والأمسيات الراقية. أوشحة الحرير خفيفة الوزن ومريحة ومتعددة الاستخدامات.</p>
        
        <h3>الصوف الميرينو: دفء وراحة</h3>
        <p>يأتي من خراف الميرينو ويتميز بألياف فائقة النعومة ومقاومة للتجعد. أخف من الصوف العادي وأكثر نعومة، مما يجعله مثالياً للارتداء اليومي في الأجواء الباردة مع الحفاظ على المظهر الأنيق.</p>
        
        <h3>الباشمينا: تراث عريق</h3>
        <p>الباشمينا هي نوع فاخر من الكشمير يُصنع من شعر ماعز الهيمالايا. تُعرف بنعومتها الاستثنائية وخفة وزنها المذهلة. وشاح باشمينا أصلي يمكن أن يمر من خلال خاتم نظراً لنعومته!</p>
        
        <h3>كيف تختار القماش المناسب؟</h3>
        <p>عند اختيار الوشاح، ضع في اعتبارك:</p>
        <ul>
          <li><strong>الموسم:</strong> الحرير للصيف، الكشمير والصوف للشتاء</li>
          <li><strong>المناسبة:</strong> الحرير للمناسبات الرسمية، الصوف للارتداء اليومي</li>
          <li><strong>العناية:</strong> بعض الأقمشة تحتاج عناية خاصة أكثر من غيرها</li>
          <li><strong>الميزانية:</strong> الكشمير والباشمينا هما الأغلى ثمناً</li>
        </ul>
        
        <p><strong>خلاصة:</strong> معرفة أنواع الأقمشة يساعدك على اتخاذ قرار مدروس عند شراء وشاح فاخر. استثمر في قطع عالية الجودة ستدوم معك لسنوات!</p>
      `,
      en: `
        <h2>The World of Luxury Fabrics: Your Complete Guide</h2>
        <p>Choosing the right fabric is the foundation of any luxury scarf. Each type of fabric has unique properties that make it suitable for different occasions and seasons. In this comprehensive guide, we'll explore the most important fabrics used in luxury scarf making.</p>
        
        <h3>Cashmere: The King of Fabrics</h3>
        <p>Cashmere is made from the hair of cashmere goats living in cold mountainous regions. It's characterized by its exceptional softness, lightweight feel, and thermal insulation ability. It's considered one of the most expensive and luxurious fabrics in the world.</p>
        
        <h3>Silk: Timeless Elegance</h3>
        <p>Silk is the most elegant and lustrous fabric. It features a smooth texture, natural sheen, and breathability. Perfect for special occasions and elegant evenings. Silk scarves are lightweight, comfortable, and incredibly versatile.</p>
        
        <h3>Merino Wool: Warmth and Comfort</h3>
        <p>Coming from Merino sheep, this fabric features ultra-soft fibers and wrinkle resistance. Lighter and softer than regular wool, making it ideal for daily wear in cold weather while maintaining an elegant appearance.</p>
        
        <h3>Pashmina: A Rich Heritage</h3>
        <p>Pashmina is a luxurious type of cashmere made from Himalayan goat hair. Known for its exceptional softness and remarkable lightweight. An authentic pashmina shawl can pass through a ring due to its incredible fineness!</p>
        
        <h3>How to Choose the Right Fabric?</h3>
        <p>When choosing a scarf, consider:</p>
        <ul>
          <li><strong>Season:</strong> Silk for summer, cashmere and wool for winter</li>
          <li><strong>Occasion:</strong> Silk for formal events, wool for everyday wear</li>
          <li><strong>Care:</strong> Some fabrics require more special care than others</li>
          <li><strong>Budget:</strong> Cashmere and pashmina are the most expensive</li>
        </ul>
        
        <p><strong>Conclusion:</strong> Understanding fabric types helps you make an informed decision when purchasing a luxury scarf. Invest in high-quality pieces that will last you for years!</p>
      `
    }
  },
  'food-storage': {
    title: {
      ar: 'كيفية العناية بأوشحتك الفاخرة',
      en: 'How to Care for Your Luxury Scarves'
    },
    image: "https://res.cloudinary.com/dfq1xxerr/image/upload/v1772210603/taj-scarf/blog/OIP_11.jpg",
    author: {
      ar: 'أحمد محمد',
      en: 'Ahmed Mohamed'
    },
    date: {
      ar: '٨ نوفمبر ٢٠٢٥',
      en: 'November 8, 2025'
    },
    content: {
      ar: `
        <h2>دليلك الشامل للعناية بالأوشحة الفاخرة</h2>
        <p>العناية الصحيحة بأوشحتك الفاخرة لا تحافظ فقط على جمالها ونعومتها، بل تطيل عمرها لسنوات عديدة. في هذا المقال، سنشارك معك أفضل طرق العناية بكل نوع من الأقمشة.</p>
        
        <h3>العناية بأوشحة الكشمير</h3>
        <p>الكشمير يحتاج عناية خاصة للحفاظ على نعومته. اغسليه يدوياً فقط بماء بارد مع شامبو أطفال خفيف. لا تعصريه أبداً، بل لفيه في منشفة لامتصاص الماء الزائد.</p>
        
        <h4>التجفيف:</h4>
        <p>افردي الوشاح بشكل مسطح على سطح نظيف بعيداً عن أشعة الشمس المباشرة. تجنبي تعليقه لأن ذلك يسبب تمدد الألياف وتغير شكله.</p>
        
        <h4>التخزين:</h4>
        <p>اطوي أوشحة الكشمير بلطف وضعيها في أكياس قماشية تسمح بالتهوية. تجنبي الأكياس البلاستيكية تماماً. أضيفي أكياس اللافندر لحماية الوشاح من العث.</p>
        
        <h3>العناية بأوشحة الحرير</h3>
        <p>الحرير حساس للغاية. اغسليه يدوياً بماء بارد مع منظف خاص بالحرير. تجنبي عصره أو لويه بقوة.</p>
        
        <h4>إزالة البقع:</h4>
        <p>في حالة البقع، استخدمي قطعة قماش مبللة واضغطي بلطف. لا تفركي أبداً لأن ذلك يتلف ألياف الحرير الرقيقة ويفقده بريقه الطبيعي.</p>
        
        <h4>الكي:</h4>
        <p>استخدمي حرارة منخفضة مع قطعة قماش واقية بين المكواة والوشاح. أو استخدمي البخار على مسافة مناسبة. الحرارة العالية تفسد ألياف الحرير.</p>
        
        <h3>العناية بأوشحة الصوف</h3>
        <p>الصوف أكثر متانة من الكشمير والحرير، لكنه يحتاج أيضاً لعناية مناسبة:</p>
        
        <h4>الغسيل:</h4>
        <p>اغسلي أوشحة الصوف يدوياً بماء فاتر. استخدمي منظف خاص بالأقمشة الصوفية. لا تستخدمي الماء الساخن أبداً لأنه يسبب الانكماش.</p>
        
        <h4>التخزين الموسمي:</h4>
        <p>عند تخزين الأوشحة لفترة طويلة، تأكدي من أنها نظيفة وجافة تماماً. ضعيها في صناديق مغلقة مع أكياس السيليكا جل لامتصاص الرطوبة.</p>
        
        <h3>نصائح عامة للعناية</h3>
        <p>• تجنبي رش العطور مباشرة على الوشاح<br>
        • دوري الأوشحة بانتظام لتقليل التآكل<br>
        • عالجي البقع فوراً ولا تتركيها تجف<br>
        • استخدمي علّاقات مبطنة للأوشحة الحريرية<br>
        • احتفظي بالأوشحة بعيداً عن الضوء المباشر</p>
        
        <p><strong>خلاصة:</strong> العناية الصحيحة بأوشحتك الفاخرة تضمن بقاءها جميلة وناعمة لسنوات طويلة. استثمري دقائق قليلة في العناية واستمتعي بأناقة تدوم!</p>
      `,
      en: `
        <h2>Your Complete Guide to Luxury Scarf Care</h2>
        <p>Proper care for your luxury scarves not only preserves their beauty and softness but extends their life for many years. In this article, we'll share the best care methods for each type of fabric.</p>
        
        <h3>Caring for Cashmere Scarves</h3>
        <p>Cashmere requires special care to maintain its softness. Hand wash only in cold water with a gentle baby shampoo. Never wring it; instead, roll it in a towel to absorb excess water.</p>
        
        <h4>Drying:</h4>
        <p>Lay the scarf flat on a clean surface away from direct sunlight. Avoid hanging it as this causes fiber stretching and shape distortion.</p>
        
        <h4>Storage:</h4>
        <p>Fold cashmere scarves gently and place them in breathable fabric bags. Avoid plastic bags entirely. Add lavender sachets to protect the scarf from moths.</p>
        
        <h3>Caring for Silk Scarves</h3>
        <p>Silk is extremely delicate. Hand wash in cold water with a silk-specific detergent. Avoid wringing or twisting vigorously.</p>
        
        <h4>Stain Removal:</h4>
        <p>For stains, use a damp cloth and press gently. Never rub as this damages the delicate silk fibers and diminishes its natural sheen.</p>
        
        <h4>Ironing:</h4>
        <p>Use low heat with a protective cloth between the iron and the scarf. Or use steam at an appropriate distance. High heat ruins silk fibers.</p>
        
        <h3>Caring for Wool Scarves</h3>
        <p>Wool is more durable than cashmere and silk, but it still needs proper care:</p>
        
        <h4>Washing:</h4>
        <p>Hand wash wool scarves in lukewarm water. Use a wool-specific detergent. Never use hot water as it causes shrinkage.</p>
        
        <h4>Seasonal Storage:</h4>
        <p>When storing scarves for extended periods, ensure they are clean and completely dry. Place them in closed boxes with silica gel packets to absorb moisture.</p>
        
        <h3>General Care Tips</h3>
        <p>• Avoid spraying perfume directly on the scarf<br>
        • Rotate scarves regularly to reduce wear<br>
        • Treat stains immediately and don't let them dry<br>
        • Use padded hangers for silk scarves<br>
        • Keep scarves away from direct light</p>
        
        <p><strong>Conclusion:</strong> Proper care for your luxury scarves ensures they remain beautiful and soft for many years. Invest a few minutes in care and enjoy lasting elegance!</p>
      `
    }
  }
};

export default function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const [isDark, setIsDark] = useState(false);
  const post = blogPosts[slug as keyof typeof blogPosts];

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  if (!post) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', paddingTop: '8rem' }}>
          <h1>{language === 'ar' ? 'المقال غير موجود' : 'Post not found'}</h1>
          <Link href="/blog" className={styles.backButton}>
            {language === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
          </Link>
        </div>
      </div>
    );
  }

  const ArrowIcon = language === 'ar' ? FiArrowRight : FiArrowLeft;

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
      <article className={styles.article}>
        {/* Back Button */}
        <Link href="/blog" className={styles.backButton}>
          <ArrowIcon className={styles.backIcon} />
          {language === 'ar' ? 'العودة إلى المدونة' : 'Back to Blog'}
        </Link>

        {/* Header Image */}
        <div className={`${styles.headerImage} ${styles.fadeIn}`}>
          <Image
            src={post.image}
            alt={post.title[language]}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Title */}
        <h1 className={styles.title}>
          {post.title[language]}
        </h1>

        {/* Meta Info */}
        <div className={styles.metaInfo}>
          <div className={styles.metaItem}>
            <FiUser className={styles.metaIcon} />
            <span>{post.author[language]}</span>
          </div>
          <div className={styles.metaItem}>
            <FiCalendar className={styles.metaIcon} />
            <span>{post.date[language]}</span>
          </div>
        </div>

        {/* Content */}
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content[language] }}
        />
      </article>
    </div>
  );
}
