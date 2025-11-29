import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Claim.css";

type FloatImage = {
  id: string;
  src: string;
  width: number;
  top: string;
  left: string;
  depth: number;
  rotate: number;
};

// Editable set of floating images. Adjust positions/size/rotation as needed.
const floatImages: FloatImage[] = [
  {
    id: "f1",
    src: "/src/assets/images/03ef1b2283de3cdc7781c5a2d3aa0cce.jpg",
    width: 160,
    top: "28%",
    left: "10%",
    depth: -50,
    rotate: -6,
  },
  {
    id: "f2",
    src: "/src/assets/images/1f4e5f5b7870e45541c13674ff73f11e.jpg",
    width: 120,
    top: "36%",
    left: "4%",
    depth: -18,
    rotate: -2,
  },
  {
    id: "f3",
    src: "/src/assets/images/3edbe916e873d29e3db7b1ab54c87597.jpg",
    width: 190,
    top: "30%",
    left: "44%",
    depth: 22,
    rotate: 5,
  },
  {
    id: "f4",
    src: "/src/assets/images/56f63e4b665d321540b148912de0e62e.jpg",
    width: 110,
    top: "44%",
    left: "76%",
    depth: -28,
    rotate: 8,
  },
  {
    id: "f5",
    src: "/src/assets/images/6d711f80a4aaf2374d2afe0c0e04cabd.jpg",
    width: 140,
    top: "60%",
    left: "10%",
    depth: -14,
    rotate: -10,
  },
  {
    id: "f6",
    src: "/src/assets/images/875f03b40c4bdca243073116d14a5d53.jpg",
    width: 160,
    top: "66%",
    left: "60%",
    depth: 14,
    rotate: 4,
  },
  {
    id: "f7",
    src: "/src/assets/images/9e0e2a8be395cbebe80fe4296dcb4a0e.jpg",
    width: 120,
    top: "20%",
    left: "76%",
    depth: -40,
    rotate: 3,
  },
  {
    id: "f8",
    src: "/src/assets/images/cfcb07dd865328849ba617c98ae71eb3.jpg",
    width: 110,
    top: "53%",
    left: "20%",
    depth: -22,
    rotate: -8,
  },
  {
    id: "f9",
    src: "/src/assets/images/d3eef75d7c0616b67215308172bf30d5.jpg",
    width: 130,
    top: "32%",
    left: "90%",
    depth: -16,
    rotate: 6,
  },
  {
    id: "f10",
    src: "/src/assets/images/f2905fd98e2710a6e4b42098b9836c5c.jpg",
    width: 115,
    top: "70%",
    left: "32%",
    depth: -12,
    rotate: -4,
  },
  {
    id: "f11",
    src: "/src/assets/images/visualelectric-1755373701143.png",
    width: 145,
    top: "1%",
    left: "48%",
    depth: 12,
    rotate: 2,
  },
  {
    id: "f12",
    src: "/src/assets/images/PinonShowww.jpg",
    width: 125,
    top: "62%",
    left: "88%",
    depth: -10,
    rotate: -3,
  },
];

function Claim() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Scroll-in animation for text block
      gsap.from(".claim__headline", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Float images parallax on scroll
      gsap.utils.toArray<HTMLElement>(".claim__img").forEach((img) => {
        const depth = Number(img.dataset.depth || 0);
        gsap.fromTo(
          img,
          { y: depth },
          {
            y: depth * 10, // stronger parallax on scroll
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // Subtle hover float — tweak strength below
        img.addEventListener("mousemove", (e) => {
          const rect = img.getBoundingClientRect();
          const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
          const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
          gsap.to(img, {
            rotateX: relY,
            rotateY: relX,
            duration: 0.4,
            ease: "power2.out",
          });
        });
        img.addEventListener("mouseleave", () => {
          gsap.to(img, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="claim" id="claim" ref={sectionRef}>
      <div className="claim__stage">
        <div className="claim__floating">
          {floatImages.map((img) => (
            <div
              key={img.id}
              className="claim__img"
              data-depth={img.depth}
              style={{
                width: img.width,
                top: img.top,
                left: img.left,
                transform: `translateZ(${img.depth}px) rotate(${img.rotate}deg)`,
              }}
            >
              <img src={img.src} alt="" />
            </div>
          ))}
        </div>
        <div className="claim__headline">
          <h2>
            We capture exhibitions, performances, and installs with the same intent you put into
            them—art-first, precise, and never generic.
          </h2>
        </div>
      </div>
    </section>
  );
}

export default Claim;
