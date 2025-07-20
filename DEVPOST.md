## Inspiration
Our inspiration comes from the heart of Ghana's agriculture. We saw firsthand how smallholder farmers, who are the backbone of our nation's food security, suffer significant losses from crop diseases. The lack of accessible, affordable, and immediate diagnostic tools creates a cycle of uncertainty and economic hardship. We were inspired to bridge this gap with technology that works for the farmer, not against them; something that understands their environment, their constraints (like limited internet access), and their urgent need for practical solutions. Sonu was born from a desire to empower every Ghanaian farmer with a powerful AI guardian in their pocket.

## What it does
Sonu is an AI-powered Progressive Web App (PWA) that provides Ghanaian farmers with instant crop disease detection and practical treatment advice, **even without an internet connection.**

*   **Instant AI Diagnosis:** Farmers can take a photo of a sick plant (cassava, maize, tomato, or cashew), and our highly optimized AI model, running directly on their phone, identifies the disease with over 95% accuracy.
*   **Offline First:** Sonu is designed for the realities of rural farming. Once installed, its core diagnostic features work flawlessly offline.
*   **Community Outbreak Mapping:** When a user is online, they can anonymously report an outbreak. This data populates a live map, allowing the entire community to see disease hotspots, track spread, and take preventative measures. It's a national agricultural immune system.
*   **Actionable Treatment Plans:** Beyond diagnosis, Sonu provides simple, step-by-step treatment guides, including both organic and locally available chemical options, making solutions accessible and affordable.
*   **User-Friendly Interface:** With a high-contrast, large-button design, the app is easy to use even in the bright sunlight of a farm.

## How we built it
Sonu is built on a modern, robust, and mobile-first technology stack, carefully chosen for performance and offline capability.

*   **Frontend Framework:** We used **Next.js 15 (with Turbopack)** and **React 19** to build a fast, server-rendered, and scalable user interface.
*   **Styling:** **Tailwind CSS** was used for its utility-first approach, allowing us to rapidly build a custom, responsive, and high-contrast UI suitable for outdoor use. The new `font-pacifico` was integrated for a unique brand identity.
*   **On-Device AI:** The core of our innovation lies in running the AI model on the client side. We took a pre-trained model and converted it to the **ONNX (Open Neural Network Exchange)** format. We then use the **`onnxruntime-web`** library to perform inference directly in the browser, which is the magic that allows for our powerful offline capabilities.
*   **Progressive Web App (PWA):** We used the `next-pwa` package to transform our application into an installable PWA. This, along with a custom **Service Worker**, allows the app to be saved to the user's home screen and run offline, caching all necessary assets and logic.
*   **UI Components:** We utilized a combination of custom-built components and primitives from **`shadcn/ui`** for a consistent and accessible design system.
*   **Deployment:** The application is deployed on **Vercel** for continuous integration, automatic scaling, and global content delivery.
*   **Map Integration:** We used **Leaflet** for the map integration.

## Challenges we ran into
Building a powerful app designed for such a specific and challenging environment was not without its hurdles.

*   **Model Optimization:** Our biggest challenge was getting the AI model's file size down without a significant loss in accuracy. A large model would make the initial app load slow and consume too much device storage. We went through several iterations of quantization and optimization to get our `.onnx` model to a size that was practical for on-device use.
*   **Seamless Offline Experience:** Architecting the PWA's service worker logic was complex. We had to ensure that not just the UI, but the entire AI inference pipeline—from image processing to running the ONNX model—was cached and fully functional offline.
*   **User Interface for Farmers:** Designing for our target user—a farmer in a field—meant thinking beyond standard UI conventions. We had to focus intensely on high-contrast colors, large touch targets, and a simplified workflow that would be intuitive under bright sunlight and potentially dusty conditions.
*   **Cross-Browser Consistency:** Ensuring the `onnxruntime-web` library and advanced PWA features worked consistently across different mobile browsers, especially on lower-end Android devices common in Ghana, required extensive testing and tweaking.

## Accomplishments that we're proud of
Despite the challenges, we are incredibly proud of what we've built.

1.  **True Offline AI:** We successfully implemented a high-accuracy (96%) AI model that runs entirely on the user's device. This is our biggest technical accomplishment and the core feature that makes Sonu truly useful for its target audience.
2.  **A Polished and Purposeful UI:** We created a user experience that is not only beautiful and modern but also deeply functional and tailored to our users' specific environment. The new "Pacifico" font and refined header/footer design are part of this polished identity.
3.  **Community-Powered Defense System:** The outbreak map is more than just a feature; it's the foundation for a network of connected farmers who can help protect each other, transforming individual data points into collective intelligence.
4.  **Building a Complete PWA:** We delivered a full-featured Progressive Web App that is installable, fast, and reliable, providing a native-app-like experience directly from the web.

## What we learned
This project has been an immense learning experience.

*   **The Power of PWAs:** We gained a deep appreciation for the capabilities of modern PWAs in bridging the gap between web and native apps, especially for delivering offline-first experiences.
*   **Practical On-Device Machine Learning:** We moved from theoretical knowledge of ML to the practical challenges of optimizing and deploying models in a resource-constrained environment like a mobile browser.
*   **Human-Centered Design is Key:** We learned that understanding your user's context is paramount. The best technology is useless if it's not designed for the environment in which it will be used.
*   **The Nuances of Mobile Web:** We delved deep into the specifics of mobile browser performance, caching strategies, and the importance of minimizing asset sizes for a global audience.

## What's next for Sonu
We see this hackathon as just the beginning for Sonu. Our vision is to make it the indispensable digital companion for every farmer in Ghana and beyond.

*   **Expand the Crop & Disease Database:** We plan to incorporate more of Ghana's staple crops, such as yams, plantains, and cocoa, and train our model on a wider array of diseases affecting them.
*   **Hyper-Local Weather & Pest Alerts:** Integrate weather APIs and pest-cycle data to provide farmers with predictive alerts, helping them proactively protect their crops.
*   **Multilingual Support:** Add support for local languages like Ewe, Dagbani, Ga, etc through voice and text to make the app even more accessible.
*   **Advanced Community Features:** Build features that allow farmers to share tips, post photos, and create local support groups directly within the app, fostering a stronger digital agricultural community.
*   **Drone Imagery Integration:** For larger farms and cooperatives, we envision a future where Sonu can analyze imagery from agricultural drones to monitor crop health on a massive scale. 