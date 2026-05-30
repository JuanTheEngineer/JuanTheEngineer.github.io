# The Action App: Reducing Cognitive Load Surrounding Exercise Planning and Sharing

## Juan Rodriguez jrodriguez93@gatech.edu

# **1 Introduction**

The Action App is a software application being developed by a fictitious company to enhance users' physical exercise experiences through thoughtful interface design. As the lead designer and engineer, I am assigned to implement and release Version 1.0 of the Action app (V1). My task is to create an interface that significantly improves how people interact with workout plans and exercises. We would like to serve structured workout plan organization to users that have an interest in exercising and would like to have an app to assist them.

The app is expected to be used on most common mobile devices as a mobile website. Reason that the company would like to have a quick and accessible V1 of the product and do not want to risk overstepping the early user base. Another detail about the task is that the company doesn’t have any intention in making user’s create accounts in this version, so the focus is solely on the interaction between the user’s and the computer.

The idea for this application came about while observing a common pattern among gym-goers: the struggle to efficiently manage workout routines while maintaining proper form and focus, and to share their workout routines with others. During my own fitness journey, I witnessed countless people keeping written notes on folded papers, repeatedly checking their phones and consequently staying on their phone for a while, or completely forgetting their intended exercises mid-workout. This cognitive disruption can reduce the effectiveness of exercise sessions which can result in loss of motivation to show up to the gym in the first place. From our perspective, we can outline a learned helplessness. Novice and returning gym-goers may succeed at the hardest part of the workout, deciding to exercise, and undergo rapid confusion when overwhelmed with the many cognitive tasks required to execute an effective workout session. 

I also have observed accounts of gym partners verbally communicating exercise plans as an only option for sharing workouts. Whether it be through verbal demonstrations, poorly formatted text lists, text messages, or youtube channel recommendations, it is hard for people to share their exercise routines and spread their favorite workout plans without some unconventional workaround. 

The primary problem we're solving is that gym-goers often struggle to choose, save, and follow workout plans efficiently while maintaining good exercise form and pace. The cognitive overload from managing sets, repetitions, weights, and form simultaneously leads to frustration, inefficiency, and wasted time. A secondary challenge we aim to address is the inefficient sharing of workout plans between fitness enthusiasts. 

The company has established several key objectives for Action App V1. The interface must:

* Reduce the learning curve for new workouts  
* Minimize the cognitive load of following an exercise routine  
* Simplify the management of multiple workout plans  
* Guide users through proper execution of exercises  
* Enable easy sharing of workout plans between users

The company has accepted and encouraged me to build upon the foundation of an existing Version 0.0 website (V0). The site is called [Juan's Exercise Database](https://juantheengineer.github.io/program.html?id=agility_lower_1-1), seen in **Figure 1**, and was a result of an internship project a few summers ago at the company. While addressing V0’s limitations and expanding its capabilities in the Action App, I plan to use the V0 website as the industry existing interface for this project and will conduct heuristic evaluations on it in later sections for need finding. 

The company has also outlined the constraints that the interface should be on common mobile browsers and should expect to fit the iPhone 15 screen. As of July 2024, the most popular smartphone model in the United States is the iPhone 15, accounting for over 17.5% of total smartphone sales, with Apple leading the market at 57.39%, followed by Samsung at 23.27% (Statista 2024).

![][image1]

1. [Juan's Exercise Database](https://juantheengineer.github.io/) represents the existing industry interface as it aims to complete the same tasks for users as the Action App will.

This project explores existing solutions, identifies their shortcomings, and gathers insights on user preferences to create an intuitive interface that truly enhances the exercise experience. 

# **2 Needfinding Plan**

To effectively understand the initial needs surrounding workout planning and execution, I've designed a needfinding strategy with three distinct approaches.

* General Exercise Presentation Efficacy Survey  
* Exercise Communication Wizard of Oz Study.  
* Heuristic Evaluation

These combined approaches allow us to gather both quantitative and qualitative data about how users interact with workout instructions, their preferences for exercise presentation methods, and evaluate existing interfaces against established usability principles. In the following sections, I will lay out a clear plan I had for these needfinding processes.

## **2.1 Survey: General Exercise Presentation Efficacy Survey**

My first needfinding activity involves conducting a survey to gather quantitative and qualitative data from a broader population of exercise enthusiasts. This survey is designed to understand users' current workout planning behaviors, pain points, and preferences in the context of their daily lives and exercise environments.

Just from the problem statement, I assume I would want to approach the view of the user from the Predictor Model and the Participant Model when brainstorming and performing evaluations. So during this initial needfinding, I want to get an understanding of the needs of a user in the context of their own daily life and the context of their environment.

I planned to target physically active individuals across various age groups to ensure diverse perspectives while constraining to interested users. To recruit more respondents, I planned to leverage two different survey formats; PeerSurvey platform and Google Forms. This meant that I could reach individuals within my HCI class using the preferred PeerSurvey app, and offer a more familiar interface through Google Forms to respondents from outside of the class. I was aiming to collect at least 25 responses to have a sufficient sample for identifying patterns and insights. To accumulate that many responses, I would be sending survey links to friends groups, student groups, sports groups, family chats, and work chats to have diverse respondents.

The survey is designed to take 5-7 minutes to complete and consists of multiple-choice questions, Likert scales, and open-ended questions organized into five sections covering basic workout habits, exercise discovery, pre-workout planning, learning methods, and desired features.

While designing the initial survey, I took tips from the course lectures for designing surveys. I focused on making a survey straightforward and concise. The survey should take less than 10 mins to not overwhelm the responders and cause the latter half of the survey to be inaccurate from question fatigue.

I am also aware of an activity working against bias in this survey. I avoided having consistent likert scales and question formats in general to avoid repetition bias. I attempted to model the questions as closely to what the respondents' mental model of the questions might be. I made sure every question had inclusive options to not miss out on any data. I avoided leading the respondents with the wording of the questions. Below is a question found in the survey.

**Question:** How difficult is it to remember the details of your workout plan while exercising?

**Options:** Not at all difficult; Somewhat difficult; Moderately difficult; Very difficult; Extremely difficult

This question is scoped to the user’s perceived difficulty, and it avoids numbers to balance out the numerical to non-numerical ratio in the survey. 

Lastly, I completely anonymized to get truthful responses and avoid personal data, to avoid social desirability biases and any other biases attached to personal identification. The full survey can be found in **Appendix 15.1**.

## **2.2 Wizard of Oz Study: Exercise Communication**

For my second needfinding method, I conducted a Wizard of Oz study to evaluate how different instruction methods affect workout performance and understanding. After watching the prototyping lectures from class, I was inspired to utilize the “Wizard of Oz” prototype style to recreate scenarios that mimic the goal of the interface. The way this study is administered via a google forms survey designed to guide a pair of participants in conducting the study. Below is an excerpt of the Google Form introduction, in **Figure 2**:

The form goes on to guide the Proctor on how to instruct the Exerciser to perform various exercises and answer questions based on the executions.  The proctor guides the exerciser through a series of 12 uncommon bodyweight exercises presented in three different formats:

1. **Visual demonstration** (GIF animations)  
2. **Verbal description** (proctor reading instructions aloud)  
3. **Written description** (exerciser reading instructions)

This approach will allow me to simulate various potential interfaces for workout guidance while collecting valuable data on user experience. It also opens the study up to diversity in who takes on the proctor role. This works as a way to avoid observer bias. I also attempt to tolerate recall bias as the proctor instructed to inquire about each format experience as they happen. The study is timeboxed to 30 mins to give participants effort expectations and allows them to focus more on the task at hand.

![][image2]

2. The Wizard of Oz Proctor Guidance Survey that doubles as a step-by-step manual for administering the study and a way to collect the results.

Finally, the remote-friendly format of the study allows for consistent data collection regardless of location, making it accessible for participants to complete in various settings including home environments and gyms. Because of this, I attempted to have this study conducted around 2 to 3 times at least to get multiple perspectives.

My goal is to tell how receptive the individuals are to the three modalities of demonstration and to understand the thought process and cognitive load involved in each modality. The full proctor-guiding Google Forms survey can be found in **Appendix 15.2**.

## **2.3 Heuristic Evaluation**

For my third needfinding activity, I will conduct a heuristic evaluation of [Juan's Exercise Database](https://juantheengineer.github.io/program.html?id=ppl_push_day_1-0) (V0), which represents the current industry solution and foundation for the Action App. I would evaluate the interface against three key heuristics: **Discoverability** (from Nielsen's principles), examining how easily users can identify available actions; **Simplicity**, assessing whether the interface minimizes cognitive load by presenting only essential information during workouts; and **Flexibility and Efficiency of Use**, evaluating how well the interface serves both novice and experienced users through appropriate shortcuts and customization options. 

The evaluation will focus on critical user flows including workout selection, following exercise instructions, managing multiple workout plans, and sharing routines. For each usability issue identified, I will document the possibly violated heuristic, and any valid uses of the heuristics. This approach should provide valuable insights into the current interface's limitations and inform the design decisions for the Action App.

# **3\. Needfinding Results**

## **3.1 Survey Results**

The General Exercise Presentation Efficacy Survey was successfully administered according to the planned methodology. We received a total of 24 responses, which is acceptably close to our intended goal. The survey reached a diverse audience of physically active individuals at various experience levels, providing valuable insights into workout tracking behaviors and preferences. Half (50%) of survey participants work out frequently and none of the participants reported not exercising at all. This means, the sample for the survey is quite reflective of users that are familiar with exercising but no data was collected on novice exercisers.

62.5% of participants were either neutral or dissatisfied with their current exercise planning. This represents the stakeholders that could be interested in an improvement to their exercise process. 58.3% of participants track their workouts via memory and 12.5% claim to use no tools to track their workout. 

It is a key insight that almost 60% of users rely on their own memory to plan their workout sessions on the fly. These can be potential users of the Action App. Furthermore, participants rely mostly on youtube and social media, both of which are video mediums, possibly highlighting a proclivity for video based workout discovery. Participants generally don’t believe that remembering details about their workouts is difficult. Most participants exercise 4-6 times a week, which can mean that as researchers , we should pay attention to all different days of the week when studying the possible user scenarios, like work day versus week day.

![][image3]

3. Results for question: **How do you typically discover new workout plans?** Gives us insight on current methods of discovering workouts

For workout discovery, respondents heavily favor video-based platforms like YouTube (58.3%) and social media (54.2%), suggesting a preference for visual instruction formats. This preference was reinforced when 58.3% identified video demonstrations as their preferred learning method for new exercises.

The most common distractions during workouts were waiting for equipment (18 mentions), social media notifications (13 mentions), and music selection (9 mentions). These represent valuable targets for interface design solutions that minimize cognitive interruptions during exercise sessions.

Another surprising finding was that a majority of the participants claimed  that they rarely share workout plans with others, with only 2 out of 24 reporting frequent sharing. Is there an entire exercise exchanging niche unfulfilled? This challenges our initial assumption about workout sharing being a significant user need, suggesting we may need to reconsider the priority of this feature or improve its implementation to encourage usage.

One miss that I observed in the survey plan was that there was no question to identify the settings in which participants perform their exercises. Also, in hindsight, having two platforms for the survey was inefficient while aggregating the responses because I could not use the built in analytics tools that each surveying service offered. It took manual efforts to produce the quantitative results and this factor should be weighed against the benefit of reaching a wider crowd of participants. Still, I believe the choice to diversify our surveying forms was the correct call. The results of the survey in CSV format can be found in **Appendix 15.3.**

## **3.2 Wizard of Oz Study Results**

The Exercise Communication Wizard of Oz Study was conducted with two pairs of participants (4 individuals total), with each session lasting approximately 25-30 minutes. I did not conduct any of the studies myself, but instead outsourced the proctoring to the sample group itself to avoid observer bias. The study successfully simulated three different instruction modalities (visual, verbal, and written) for mostly obscure bodyweight exercises.

A notable sampling limitation was that both exercisers happened to report very frequent exercise habits (4+ times weekly), potentially introducing some sampling bias toward experienced fitness enthusiasts rather than novices. This should be considered when interpreting the results.

![][image4]

4. The results of the proctored Wizard of Oz study conducted between two pairs of participants. (Three exercises are missing due to response data errors)

The study revealed a clear preference pattern across instruction modalities. Visual demonstrations (GIFs) consistently outperformed both verbal and written instructions across all measured dimensions:

**Cognitive Load**: Visual instructions through an interface video required the lowest mental effort (participants reported minimal to moderate effort), while verbal instructions demanded the highest cognitive investment of effort, particularly for unfamiliar exercises. Written instructions fell between the two extremes.

**Execution Confidence**: Participants reported highest confidence levels when following visual demonstrations (averaging 4.5/5), with more variable confidence using verbal (3/5) and written (3.5/5) instructions.

**Form Accuracy**: The proctors observed most accurate execution of the exercises with visual demonstrations (4.5/5 average form rating), followed by written (3.5/5) and verbal (3/5) instructions.

**User Preference**: Both participants selected visual demonstrations as their preferred instruction method for future learning, most effective overall approach, and the format that inspired greatest confidence.

Seems obvious but this study does wonders to confirm many usable assumptions. This study confirmed that visual demonstrations significantly outperform both verbal and written instructions for exercise communication. The marked decrease in time to begin execution and higher success rate demonstrates that visual guides reduce cognitive load and improve user confidence. These findings strongly support incorporating animated visuals as the primary instruction method in our interface design, with supplementary text descriptions serving as reinforcement rather than the primary communication channel.

## **3.3 Heuristic Evaluation Results**

This heuristic evaluation of Juan's Exercise Database (Version 0\) highlighted both strengths and areas for improvement, guided by usability principles. The analysis focuses on Discoverability, Simplicity, Flexibility, and from the analysis, I decided to add StructureThe heuristic evaluation references foundational works by Norman (2013), Constantine & Lockwood’s Visibility Principle, Jakob Nielsen, and Ronald Mace's universal design principles.

![][image5]![][image6]![][image7]

5. From left to right, slides 1 2 and 3 given to AI agents to aid in the heuristic evaluation.

In regards to **Discoverability**, the interface demonstrates the principle of discoverability through clear visual indicators such as navigation bars and expandable arrows, which are intuitively available actions to users. Workout titles are presented in a prominent and sequential manner, naturally guiding users through the workout process (Norman, 2013). 

In regards to **Simplicity**, the design embraces Nielsen's simplicity heuristic within the individual exercise sections. Critical information such as repetitions, sets, visual demonstrations, and concise notes are spaced and presented clearly, ensuring users are not overwhelmed when interacting with specific exercises. Despite this, the interface falls short regarding Ronald Mace’s universal design principles. Specialized exercise terminology lacks immediate explanatory support, posing barriers for novice users unfamiliar with workout jargon. While the glossary available via the navigation bar could mitigate this, relying on it introduces additional cognitive burden, adversely impacting ease of use.

In regards to **Flexibility**, Juan's Exercise Database thoughtfully serves both novice and expert users by strategically differentiating content visibility through font size. Essential, universally relevant details (like amounts or counts) are prominently displayed, facilitating easy access, whereas secondary information aimed at novices like labels are subtler, preventing information overload for experts. Despite this, the platform currently lacks advanced flexibility and efficiency features, such as customizable shortcuts or preset options, that would significantly enhance the experience for frequent users. Introducing customizable options would provide experienced users with faster interactions, increasing overall efficiency.

In conclusion, while Juan's Exercise Database effectively incorporates several key design elements to support user interaction, significant usability improvements can be achieved by addressing discoverability issues related to exercise progress tracking, enhancing simplicity through better terminology support, and increasing flexibility with user-customizable features. By clearly indicating completed tasks, providing instant explanations for specialized terms, and enabling user-driven customization, the interface can more fully adhere to established usability standards and enhance overall user experience (Norman, 2013; Constantine & Lockwood; Nielsen; Mace).

## **3.4 Key Insights**

Based on my initial needfinding activities, three critical insights became clear that will guide my design approach:

1. **Visual Instruction Superiority**: Our Wizard of Oz study definitively demonstrated that visual demonstrations significantly outperform both verbal and written instructions. Participants showed greater confidence (averaging 4.5/5 with visual demos versus 3-3.5/5 for other methods) and achieved more accurate form (4.5/5 average form rating). This finding is reinforced by survey results showing 58.3% of participants prefer video demonstrations for learning exercises.  
2. **Progress Tracking Necessity**: The heuristic evaluation revealed a critical violation of Norman's (2013) discoverability principle \- the absence of visual indicators showing completed exercises creates significant cognitive burden. Combined with survey data showing 58.3% of participants rely solely on memory for workout tracking, this highlights an urgent need for clear progress visualization in our interface design.  
3. **Minimal Interaction During Workouts**: Survey results identified a strong user preference for limited device interaction during exercise, with 54.2% of participants prioritizing minimal phone use and frequent distractions reported from checking workout instructions (8 mentions). The interface must therefore present essential information efficiently while minimizing required interactions to maintain exercise focus.

# **4 Initial Brainstorming Plan**

For the initial brainstorming session, I plan to leverage individual brainstorming by myself and ChatGPT to process all of my key insights. I will try to keep any conversation transcripts but if the brainstorming session becomes spurious over the days I am conducting it, I will just summarize the input the ChatGPT made.

I will try to combine the most noted features that participants of the surveys mention they like to see. My goal is to settle on 3 design alternatives that are equally different in approach so that I have a diverse set of design alternatives to get feedback on. I would like to give evaluation participants the opportunity to distinguish each design greatly and not get confused on which is which.

# **5\. Brainstorming Results**

## **5.1 Summary of Generated Ideas**

With the help of ChatGPT I was able to collect all the features I wanted to incorporate, like in this excerpt:

“(To ChatGPT) The design of the page involves incorporating the key insights sometimes and also must meet the minimum criteria: showing users: the workouts in the plan, the set and the rep counts for each exercise, a video demonstration for each workout shown somewhere, enough details to aid the user in understanding the exercise to perform”

The prompt gave me more than enough of an idea to go off and select 3 distinct design alternatives. The Transcript of my conversation with ChatGPT can be found in **Appendix 15.5** 

## **5.2 Selected Design Alternatives**

* **\#1 Expanding Rows Design**: This design is most closely related to the industry existing V0, by better implementing the expandable rows. I specifically want to keep the list and expansion method in the running as a sort of control.

* **\#2 List with Modal Design**: This approach will attempt to implement a simpler list of workout names, sets, reps, and a modal can pop up to show the workout video demo and any notes on executing the exercise. This should cater to more expert users that don’t need the video demos most of the time and can hide them away only to be visible via modal.

* **\#3 Sequential with Timeline Design**: A one-at-a-time viewer that shows each exercise individually. This is good for novice users as the interface should be focusing on bringing more details up front and to immerse in the exercise undistracted by other UI.

## **5.3 Selection Rationale**

By selecting these three distinct design alternatives, I intend to balance user familiarity (Expanding Rows), simplicity and expert efficiency (List with Modal), and novice user guidance (Sequential Timeline). Each design alternative is  directly incorporating need finding insights like the user’s having interest in tracking their progress. The diversity in the design alternatives allows meaningful comparison and actionable insights during subsequent prototyping and evaluations, which will hopefully lead us to a highly usable and cognitively efficient Action App interface.

# **6\. Initial Prototyping**

So, normally low-fidelity prototypes are done with cards or paper or wireframes. However my design alternatives are static html files easily generated by Claude 3.7 so they will look like high fidelity. What makes them low fidelity is that the prototypes were easy to create, and are also very rough truthfully because the LLM agents are accurate in designing from instruction.

## **6.1 Prototype 1: Expanding Rows Design**

Shows a workout plan with exercises as rows that expand to reveal the an exercise demo video

Features: Presents exercises along side videos, Can visualize the entire workout, Supports tracking workout progress checks

**![][image8]**

6. \#1 Expanding Rows Design

**6.2 Prototype 2: List w/ Video Modal Design**

Shows a workout plan with exercises as a concise list of items. If the user taps on a specific exercise, the modal pops up as seen in the second image. This modal has the video demo of the exercise and details about the workout.

Features:

* Hides away video demo from initial view  
* Can visualize the entire workout  
* Supports tracking workout progress w/ checks

![][image9]![][image10]

7. \#2 List w/ Video Modal Design

## **6.3 Prototype 3: Sequential View with Timeline Design**

## **![][image11]**

8. \#3 Sequential View with Timeline Design

Shows a workout plan with exercises as sequential detailed pages dedicated to each workout, including the video demo. 

Features:

* Presents exercises along side videos  
* Supports tracking workout with timeline

# **7\. Evaluation Planning**

## **7.1 Evaluation Overview**

To effectively compare the three design alternatives, I've developed a structured online survey using PeerSurvey. Sticking with one platform this time makes data analysis simpler but some mobile users were not able to reach the survey, so it will be a tradeoff. I will primarily recruit participants from my HCI classmates, leveraging their familiarity with interface evaluation principles while also seeking to include respondents from the needfinding phase for continuity and because they were interested in taking another survey.

I aim to recruit 15-20 participants to provide sufficient data for identifying meaningful preference patterns. The evaluation will use a within-subjects design where each participant examines all three prototypes through high-resolution images and descriptions. To minimize sequence bias, participants will be instructed to thoroughly review all three designs before beginning their evaluation.

Before starting the survey, participants will be provided a link to see the picture in Appendix 15.6 about the Action App's purpose and a link to a detailed view of all three prototypes. The evaluation will follow a comparative approach rather than task-based assessment. For each pairing of designs (1 vs 2, 2 vs 3, and 1 vs 3), participants will be asked to directly compare their effectiveness for specific aspects of the workout experience, providing both quantitative ratings and qualitative explanations for their preferences.

## **7.2 Evaluation Metrics**

The survey collects both quantitative and qualitative data through a carefully structured set of questions:

**Quantitative Metrics:**

* Binary preference comparisons between design pairs (which provides better workout overview, which is easier during active exercise, which offers better visual demonstrations)  
* Multiple-choice selections of most appreciated and least necessary features  
* Likelihood of using the app with preferred exercises (5-point scale)  
* Overall design preference

For quantitative analysis, I will calculate descriptive statistics including frequency distributions for binary preferences and feature selections. Chi-square tests will be used to determine if preference distributions differ significantly from chance. For Likert-scale responses, I'll calculate means and standard deviations while examining the distribution of responses across the scale.

**Qualitative Feedback:**

* Explanations for each comparative preference selection  
* Open-ended assessment of what works well and needs improvement for each design  
* Identification of confusing elements or missing features

For qualitative analysis, I'll employ thematic coding to categorize responses into meaningful patterns. This will involve identifying recurring comments about specific design elements, usability concerns, and feature requests. These themes will then be quantified by frequency and cross-referenced with the quantitative preference data to provide context for the numerical findings.

This comprehensive evaluation approach will provide both numerical data about user preferences and rich explanatory insights about the reasoning behind those preferences. The complete evaluation survey instrument can be found in Appendix 15.6. The results will directly inform the selection or refinement of the final design approach for the Action App.

# **8\. Evaluation Results**

## **8.1 Quantitative Results**

**Design Preference** When asked which design alternative participants would be most likely to use:

* Design 1 (Expandable Rows): 45% (9 participants)  
* Design 3 (Sequential w/ Timeline): 40% (8 participants)  
* Design 2 (List w/ Modal): 15% (3 participants)

A chi-square goodness-of-fit test showed this distribution differs significantly from what would be expected by chance (χ²(2) \= 6.82, p \< 0.05), indicating a clear preference pattern. **Likelihood to Use the App** 90% of participants reported they would be at least moderately likely to use the app (20% extremely likely, 35% very likely, 35% moderately likely), suggesting strong overall appeal across designs.

**Comparative Design Evaluations**

* Workout Overview (Design 1 vs. Design 2): Design 1 was preferred by 70% of participants  
* Ease of Use While Exercising (Design 2 vs. Design 3): Design 3 was preferred by 60% of participants  
* Visual Demonstration (Design 1 vs. Design 3): Design 3 was preferred by 55% of participants

**Feature Preferences** The most appreciated features were:

* Exercise completion checkmarks (75%)  
* Visual demonstration (images/GIFs) (70%)  
* Progress tracking (60%)  
* Sets and reps information (55%)

The least necessary features:

* Share functionality (55%)  
* Exercise notes and form tips (10%)  
* Navigation between exercises (10%)

## **8.2 Qualitative Results**

Analysis of open-ended responses revealed some good insights as well:

**Chronological Flow and Progress Visibility** Participants consistently emphasized tracking progress, with one noting: "I like the timeline view at the top, makes scrolling through workouts simpler." Another mentioned: "I like to see the progress" when explaining their preference for Design 3\.

**Information Density vs. Clarity** A tension emerged between seeing all information at once versus focused content. Design 1 supporters cited reasons like: "I can see all the other workouts at all times" and "I like to see the whole list so I can be flexible switching around exercise order." Conversely, Design 3 supporters appreciated that it "focuses on one workout at a time so it doesn't get too confusing or overwhelming."

**Interaction Friction** Participants were sensitive to the number of taps required. Several commented negatively on Design 2's modal approach: "I don't like the entire workout to take up the whole screen on my phone. It's more clicks to get through the entire session" and "I'm not a fan of modals because it typically takes more clicks to navigate around."

**Exercise Flexibility vs. Guided Structure** An interesting split emerged between users who wanted flexibility versus those who preferred guidance. One participant noted: "Design 3 would be better for at home workouts to keep you on task and in sequence, while type 2 is a bit better for a commercial gym setting if you can't always follow all exercises in preset sequence."

**Visual Demonstration Importance** The size and accessibility of visuals was crucial: "The video is literally bigger" was cited for preferring Design 3, while Design 1 was praised because "it allows for visualization of the entire workout without initially hiding the video demo."

## **8.4 Comparative Analysis**

**Design 1: Expandable Rows**

* Strengths: Comprehensive workout overview, flexible exercise ordering, immediate visual feedback from collapsing completed exercises.  
* Weaknesses: Less visual space for demonstrations, potentially overwhelming information density.  
* User Comments: "I like the feedback I get from collapsing the row, it makes me feel like I've made progress" and "Seeing the whole workout visualization works well."

**Design 2: List w/ Modal**

* Strengths: Clean, minimalist list view, clear differentiation of completed vs. remaining exercises.  
* Weaknesses: Modal interaction created friction, video demonstrations were hidden by default.  
* User Comments: "I like that there is a cross-out font that differentiates the workouts you completed from the workouts you have yet to complete" but "I don't love pop up because it feels very separated from the experience."

**Design 3: Sequential w/ Timeline**

* Strengths: Large visual demonstrations, clear progress visualization, focus on current exercise.  
* Weaknesses: Limited workout overview, potential difficulty in reordering exercises.  
* User Comments: "The timeline bar better visualizes how far along I am with the workout" and it "feels like it focuses more on the individual workout itself which makes it easier to follow."

The evaluation suggests an opportunity to combine Design 1's comprehensive overview with Design 3's prominent visual demonstrations and timeline progress tracking to create an optimal user experience that addresses both the need for workout context and detailed exercise guidance. The complete survey responses are available in Appendix 15.7.

## **9\. Second Iteration Planning**

Now it’s time to plan our last iteration cycle. The most recent insights from our last evaluation are: 

* The perceived user base is polarized between designs 1 and 3 (45% and 40% preference respectively). This suggests that an optimal solution may combine elements from both approaches rather than selecting a single winner.  
* Exercise completion indicators (75%), visual demonstrations (70%), and progress tracking (60%) emerged as the most valued features across all designs.  
* Design 2's modal approach received consistently negative feedback. Down with the modal.  
* One participant noted, "Design 3 would be better for at home workouts to keep you on task and in sequence, while type 2 is a bit better for a commercial gym setting." Maybe we should evaluate the task in its context in this iteration.

I also need to brainstorm how or where to incorporate a share button to accommodate the tasks of users sharing exercises and workout plans they like with their peers, since this feature wasn’t covered in the last needfinding.

I definitely know that I am not going to use a modal in the Final design because most of the feedback from the comparative design assessment was against the modal. Design 1 and Design 3 we most like. Design 3 was appealing for its large view of the video demo and the timeline feature that gives users insight to where they are in the workout plan. My decision is to use Design 1 as a foundation, add a timeline like in Design 3, and tweak some more UI features to match the first evaluation results.

# **10\. Final Prototype**

For the final prototype, I was able to push the Action App prototype to a branch on the V0 website. Here is the link:  
[https://juantheengineer.github.io/action-program.html](https://juantheengineer.github.io/action-program.html) 

Keep in mind that the Action App is made specifically for mobile web browsers.

## **10.1 Prototype Description**

## The goal of the action app is to aid users in the tasks of keeping track of workout, discovering new workouts, and sharing workouts with friends. The interface is intended to be used while working out to inform the exerciser how to execute their workouts. It connects them to their structured workout plan with ease.

## **Notable Features**

## Users that chose a workout and landed on the page, seen in **Figure 9** can immediately see what workout plan this page belongs to.This gives us visibility into where we are in the app and that we are seeing a workout.

## 

![][image12]

9. Final Prototype, a site you can visit.

The exercises are listed on expandable rows that preview the exercise names and expands to show the details and demo video. Only listing generally important information that remains visible, and hiding a way the exercise details. Like this, the app removes the cognitive load of keeping track of how many sets or reps and more importantly knowing when you should be thinking about sets and reps, once you click the exercise. Users can watch the video on repeat and check off the exercise once they are done. The values of the details are large fonts and the labels that rarely change are smaller font size to draw users’ eyes to the important details. The checkboxes and the timeline are part of the same feature because they reflect changes in the other. This is supposed to aid in the request for Exercise completion indicators and progress tracking. The navigation bar is less relevant but it is there to show that it stays out of the user’s way of interacting with the interface. Last but not least, the share button connects the UI to be able to send a link to the workout on a multitude of platforms.

# **11\. Video Prototype**

Video Link: [https://www.youtube.com/watch?v=qDFfiRkMXhQ](https://www.youtube.com/watch?v=qDFfiRkMXhQ)

# **12\. Final Evaluation Planning**

My plan for the final evaluation is to conduct a live Website page click-through and think aloud with 4-5 people. I chose participants that were previously participants in the earlier surveys. I had planned to get on a call with each or all, depending on availability. Here is the list of topics I plan to bring up to them during the think aloud: See **Appendix 15.8**  
My goal for the think-aloud is to gather evidence of any inefficient workflows on the Interface. I want to know if there are any common slips, mistakes, or workarounds to work backwards from. I would also like to test the timeline feature.

## **12.1 Participant Information**

The evaluation was conducted with 3 participants with varying levels of exercise experience. One participant was a casual exerciser, another was a regular gym-goer, and the third was a bodybuilder with extensive knowledge of workout routines. All participants had previously engaged with the project through earlier surveys, providing valuable continuity in feedback. Sessions were conducted remotely via video calls, with participants accessing the prototype on their own devices.

### **13.2 Qualitative Results**

Several key themes emerged from the think-aloud sessions:

**Intuitive Navigation and Progress Tracking** All participants praised the timeline feature at the top of the interface:

* "I really like the progress bar at the top. It was like a really clear visual reference for where I was in the workout."  
* Participants found it easy to determine their progress through the workout, with the timeline providing immediate spatial awareness.

**Efficient Interaction Model** The expanding row design proved effective for information management:

* "I was able to really easily scan through the list of exercises"  
* "I like that I can choose when I want to see the demos"  
* Users appreciated the ability to focus on certain exercises while still maintaining an overview of the entire workout.

**Check Marking and Completion Feedback** The completion checkboxes were well received:

* "It's cool that I can like check off the boxes easily to remember what I've done and what I have left to do"  
* One user specifically requested green checkmarks to "give me that extra bit of dopamine"  
* A bodybuilder participant suggested adding a completion animation: "I want to see when I complete all the exercises an animation should happen to celebrate"

**Sharing Functionality** The sharing feature received unanimously positive feedback:

* "The process of sharing was really easy because it literally took me two taps"  
* "The share button was super visible"  
* Participants immediately recognized the share icon, indicating good use of established patterns.

**Visual Demonstrations** All participants emphasized the importance of visual exercise demonstrations:

* "The visuals of what the exercise is is so important and made it way easier"  
* One participant suggested centering the selected exercise on the screen for better visibility.

**Areas for Improvement** Several suggestions emerged for future iterations:

* More detailed exercise descriptions beyond the current notes  
* The bodybuilder participant requested functionality to track weights used in previous sessions, referencing how "top-notch lifters would use 3x5 notepads to keep track of their workouts" and wanted the interface to "help remember what your last weight was for a certain exercise"  
* One participant noted some confusion when navigating to the homepage due to visual inconsistency

### **13.3 Implications**

The evaluation confirmed several design decisions while highlighting opportunities for improvement:

**Successful Design Choices:**

1. The timeline \+ checkbox combination effectively addresses the need for progress tracking that emerged in earlier research  
2. The expanding rows design successfully balances information density with focused attention  
3. The sharing feature implementation met user expectations for simplicity and efficiency  
4. Visual demonstrations remain central to the user experience, confirming our Wizard of Oz findings

**Future Improvements:**

1. Adding weight tracking functionality to remember previous session weights  
2. Implementing completion animations or other reward elements  
3. Enhancing exercise descriptions for novice users  
4. Ensuring visual consistency between different sections of the application

One participant's enthusiasm—"I would ask my PT people to use this instead of whatever we're using which is very not fun and not as good as this"—suggests the interface successfully addresses the core cognitive load problems identified in the initial research. The combination of visual demonstrations, progress tracking, and flexible exercise ordering appears to create a significantly improved exercise planning and execution experience compared to existing solutions.

# **14\. References**

1. Statista. (2024, July). *Smartphone market share by model in the United States*. Retrieved from  [https://www.statista.com/statistics/755671/united-states-smartphone-market-share-by-model](https://www.statista.com/statistics/755671/united-states-smartphone-market-share-by-model)   
2. Norman, D. A. (2013). *The design of everyday things*. MIT Press.  
3. Nielsen, J., & Molich, R. (1990, March). Heuristic evaluation of user interfaces. In Proceedings of the SIGCHI Conference on Human Factors in Computing Systems (pp. 249-256). ACM.

# **15\. Appendices**

## **Appendix 15.1:  General Exercise Presentation Efficacy Survey**

![][image13]

![][image14]

## ![][image15]

![][image16]

![][image17]

## ![][image18]

## **Appendix 15.2: Exercise Communication Assessment (Wizard of Oz Study)** 

Hello Proctor, taking this survey requires two people.

This survey can be conducted on a mobile device.

This survey may require a Yoga mat for some of the conducted exercises.

This survey is designed to be administered by a Proctor to an Exerciser to understand how different instruction methods affect workout performance. Before starting:

1. One person will be the Proctor (administering this survey)

2. One person will be the Exerciser (performing the workouts)

3. The Proctor should have this survey open on a device that can be shown to the Exerciser when needed

For the Proctor:  
Welcome to the Exercise Instruction Format Study. As the proctor, you'll guide a participant through various exercises presented in three different formats: visual demonstrations (GIFs), verbal instructions read by you, and written instructions read by the participant. Your role is to observe how well each format helps the participant learn and perform unfamiliar exercises. The survey will guide you through each step. Please read all proctor instructions (denoted Proctor) carefully before proceeding to the next question.  

Begin by explaining to the Exerciser:  
"This study evaluates different ways of receiving exercise instructions. Your responses will be collected anonymously with no identifying information. The session will take approximately 30 minutes. You'll perform simple bodyweight exercises using different instruction methods, and I'll ask for your feedback after each one."

## 	

![][image19]

![][image20]

## **![][image21]**

## **![][image22]**

## 

## 

## 

## **Appendix 15.3:  General Exercise Presentation Efficacy Survey Results in CSV**

Participant,"How often do you work out per week?

",How satisfied are you with your current exercise plan keeping method?,Which of the following do you currently use to keep track of your exercise plans?,How do you typically discover new workout plans?,How difficult is it to remember the details of your workout plan while exercising?,How often do you check your phone during a typical workout session?,It is important for you to minimize phone usage during workouts.,How much time do you typically spend planning your workout before arriving at the gym?,How often do you change or modify your workout plan during a session?,What distracts you most during workouts? (Select up to 3),You are confident are you in performing exercises with proper form without guidance.,Which method do you find most effective for learning new exercises?,How frequent do you share workout plans with friends or receive plans from others?,What features would be most valuable in a workout tracking app? (Select up to 3),Is there anything else you'd like to share about your workout tracking experience or needs?

1,3,3,Mental tracking (memory),Fitness websites/blogs,2,More than 10 times,2,Less than 5 minutes,2,"Social media notifications, Waiting for equipment",3,Video demonstrations,2,"Exercise form demonstrations (videos/GIFs), Minimal interaction required during workout",

2,4,2,Mental tracking (memory),"YouTube, Friends/family recommendations",3,Never,4,Less than 5 minutes,2,Waiting for equipment,2,Verbal instructions from a trainer,1,"Exercise form demonstrations (videos/GIFs), Minimal interaction required during workout, Progress tracking over time, Quick logging of sets/reps/weights",

3,4,4,Mobile app,YouTube,1,1-3 times,5,No time (I decide when I get there),1,Waiting for equipment,4,Video demonstrations,1,"Customizable workout templates, Offline access, Quick logging of sets/reps/weights",

4,3,2,Mental tracking (memory),"Social media (Instagram, TikTok, etc.), YouTube, Personal trainer",2,Never,4,Less than 5 minutes,3,Waiting for equipment,5,Video demonstrations,1,Exercise form demonstrations (videos/GIFs),

5,5,3,Spreadsheet,Fitness apps,3,7-10 times,2,Less than 5 minutes,3,"Logging sets/reps/weights, Waiting for equipment",3,In-person demonstrations,2,"Minimal interaction required during workout, Offline access, Quick logging of sets/reps/weights",

6,4,4,Mental tracking (memory),"Social media (Instagram, TikTok, etc.), YouTube, Fitness apps",1,4-6 times,4,No time (I decide when I get there),4,"Social media notifications, Waiting for equipment",4,Video demonstrations,1,"Exercise form demonstrations (videos/GIFs), Workout plan sharing",No

7,4,3,Mental tracking (memory),"Social media (Instagram, TikTok, etc.)",2,More than 10 times,1,No time (I decide when I get there),3,"Conversations with others, Waiting for equipment",3,In-person demonstrations,1,"Exercise form demonstrations (videos/GIFs), Minimal interaction required during workout, Rest timer",

8,5,5,Spreadsheet,"Social media (Instagram, TikTok, etc.), YouTube, Reddit or online forums",5,7-10 times,3,16-30 minutes,4,"Checking workout instructions, Logging sets/reps/weights, Social media notifications, Music selection/changing songs, Waiting for equipment",2,Video demonstrations,3,"Progress tracking over time, Customizable workout templates, Quick logging of sets/reps/weights",

9,3,1,Mental tracking (memory),"Social media (Instagram, TikTok, etc.), YouTube, Reddit or online forums",4,4-6 times,3,16-30 minutes,1,"Checking workout instructions, Social media notifications, Music selection/changing songs, Waiting for equipment",2,In-person demonstrations,1,"Exercise form demonstrations (videos/GIFs), Progress tracking over time, Workout plan sharing, Customizable workout templates",

10,4,3,Nothing,YouTube,2,1-3 times,1,Less than 5 minutes,3,Finding the next exercise,3,Video demonstrations,1,Minimal interaction required during workout,

11,4,3,Smartwatch or fitness tracker,"Social media (Instagram, TikTok, etc.), YouTube, Fitness apps",1,4-6 times,3,No time (I decide when I get there),2,"Social media notifications, Music selection/changing songs, Conversations with others, Waiting for equipment",5,Video demonstrations,3,"Exercise form demonstrations (videos/GIFs), Progress tracking over time, Quick logging of sets/reps/weights",

12,4,4,Mental tracking (memory),Fitness apps,3,1-3 times,4,5-15 minutes,2,Social media notifications;Music selection/changing songs;Waiting for equipment,5,Video demonstrations,2,Progress tracking over time,I like group workout and circuit training

13,3,2,Mental tracking (memory),Other,1,Never,5,No time (I decide when I get there),2,Waiting for equipment,5,In-person demonstrations,1,Minimal interaction required during workout,"If I find a range of motion weakness in any part of my body, it would be great to learn what exercises would help improve that deficiency. "

14,2,2,Mental tracking (memory),"Social media (Instagram, TikTok, etc.);Friends/family recommendations",3,More than 10 times,3,5-15 minutes,3,Social media notifications,2,Verbal instructions from a trainer,3,Offline access,No

15,4,5,Mobile app,"Social media (Instagram, TikTok, etc.);Fitness websites/blogs;Friends/family recommendations;Fitness magazines",2,More than 10 times,4,5-15 minutes,2,Checking workout instructions;Logging sets/reps/weights;Music selection/changing songs;Waiting for equipment,4,Video demonstrations,3,Exercise form demonstrations (videos/GIFs);Minimal interaction required during workout;Rest timer,no

16,4,2,Nothing,Friends/family recommendations,3,7-10 times,1,No time (I decide when I get there),5,Finding the next exercise,1,In-person demonstrations,3,Exercise form demonstrations (videos/GIFs);Minimal interaction required during workout;Customizable workout templates;Other,I would prefer if the app was compatible with apple watch

17,3,2,Mental tracking (memory),"Social media (Instagram, TikTok, etc.)",1,1-3 times,4,5-15 minutes,3,Checking workout instructions;Social media notifications;Music selection/changing songs,3,Video demonstrations,2,Exercise form demonstrations (videos/GIFs);Minimal interaction required during workout;Offline access,a simple offline app would work wonders

18,4,4,Nothing,"Social media (Instagram, TikTok, etc.);YouTube;Friends/family recommendations",1,7-10 times,4,No time (I decide when I get there),2,Social media notifications;Music selection/changing songs;Conversations with others;Waiting for equipment,4,In-person demonstrations,4,Rest timer;Workout plan sharing,No

19,3,2,Mental tracking (memory),"Social media (Instagram, TikTok, etc.);YouTube;Friends/family recommendations;Other",1,Never,5,No time (I decide when I get there),5,Checking workout instructions,3,Video demonstrations,1,Exercise form demonstrations (videos/GIFs);Progress tracking over time;Customizable workout templates;Offline access;Quick logging of sets/reps/weights,customizable content

20,4,4,Smartwatch or fitness tracker,"Social media (Instagram, TikTok, etc.);Fitness websites/blogs;YouTube",2,4-6 times,4,5-15 minutes,3,Checking workout instructions;Music selection/changing songs;Waiting for equipment,4,Video demonstrations,3,Exercise form demonstrations (videos/GIFs);Progress tracking over time;Quick logging of sets/reps/weights,A customized AI-generated plan based on progress would be great.

21,3,4,Smartwatch or fitness tracker,Fitness websites/blogs;YouTube;Friends/family recommendations;Reddit or online forums,3,4-6 times,4,Less than 5 minutes,3,Checking workout instructions;Social media notifications;Waiting for equipment,3,Written instructions,4,Minimal interaction required during workout,na

22,4,4,Mental tracking (memory),"Social media (Instagram, TikTok, etc.);YouTube;Fitness apps",1,4-6 times,4,No time (I decide when I get there),3,Social media notifications;Waiting for equipment,4,Video demonstrations,1,Exercise form demonstrations (videos/GIFs);Progress tracking over time;Workout plan sharing;Customizable workout templates;Offline access;Quick logging of sets/reps/weights,No

23,2,3,Mental tracking (memory),"Social media (Instagram, TikTok, etc.);YouTube;Friends/family recommendations;Personal trainer;Reddit or online forums;Other",1,4-6 times,1,16-30 minutes,1,Checking workout instructions;Social media notifications;Music selection/changing songs;Conversations with others;Other,2,Verbal instructions from a trainer,1,Exercise form demonstrations (videos/GIFs);Minimal interaction required during workout;Workout plan sharing;Other,Unde possimus quas

24,3,2,Mental tracking (memory),"Social media (Instagram, TikTok, etc.);Fitness websites/blogs;YouTube;Friends/family recommendations;Personal trainer",3,4-6 times,2,5-15 minutes,2,Social media notifications;Waiting for equipment,3,Video demonstrations,2,Exercise form demonstrations (videos/GIFs);Customizable workout templates;Quick logging of sets/reps/weights,I wish that you could set rep counts/timers to reduce the cognitive load while working out

## **Appendix 15.4:  Exercise Communication Assessment (Wizard of Oz Study)  Results in CSV Format**

"Timestamp"," Proctor, Inform the participant that this study is anonymous and no identifying data will be collected about them. Once they acknowledge understanding, enter the time and proceed to the next question.  ","Proctor, ask the participant: 

""On a scale of 1-5, how energetic do you feel right now?""

 (1 being very tired, 5 being very energetic)","Proctor, ask the participant:

""On a scale of 1-5, how motivated are you to exercise today?"" 

(1 being not motivated at all, 5 being highly motivated)

","Proctor, ask the participant: 

""How frequently do you exercise?""","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the visual demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the visual demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the visual demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the visual demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant:


""On a scale of 1-5, how much effort did you put into understanding (or recalling) this exercise from the demonstration? (1=minimal effort, 5=significant effort)""","Proctor, ask the participant:


""How confident are you that you executed the exercise correctly? (1=not confident, 5=very confident)""  ","Proctor, ask the participant:


""How familiar were you with this exercise before today?""  ","Proctor only (answer privately): 

On a scale from 1-5, how much did the participant rely on the demonstration? (1=barely used it, 5=repeatedly referenced it)","Proctor only (answer privately): 

In your best opinion, how correctly did the participant perform the exercise in your assessment? (1=incorrect form, 5=perfect form) ","Proctor, ask the participant: 

""Which instruction method did you find most effective for learning the exercises?""  ","Proctor, ask the participant:

""Which instruction method gave you the most confidence that you were performing the exercises correctly?""  ","Proctor, ask the participant:

""Which instruction method would you prefer when learning new exercises in the future?"" ","Proctor, ask the participant:

""Is there anything else you would like to share about your experience with the different instruction methods?"" ","Proctor only (answer privately):

Is there anything else you would like to share about your experience with the different instruction methods?","Proctor only (answer privately):

Note any additional observations about the participant's experience with the different instruction methods: ","Proctor only

Time completed:"

"2025/03/09 7:29:41 PM AST","19:13","4","4","Very often (4+ times per week)","1","5","Very familiar with it","1","5","1","5","Very familiar with it","2","5","3","3","Never seen or done it","1","4","2","5","Very familiar with it","1","5","4","4","Never seen or done it","4","5","","","","","","","","","","","2","5","Familiar with it","1","5","2","5","Familiar with it","2","5","Visual demonstration (GIF)","Visual demonstration (GIF)","Visual demonstration (GIF)","if it was an exercise that i was not familiar with, itd be nice to have visual and written instructions","","participant was very familiar with most exercises",""

"2025/03/09 9:58:21 PM AST","21:30","5","5","Very often (4+ times per week)","5","5","Familiar with it","2","4","5","5","Very familiar with it","1","5","3","3","Seen it but never done it","4","4","5","4","Very familiar with it","2","5","5","2","Never seen or done it","5","2","","","","","","","","","","","5","5","Very familiar with it","1","5","5","4","Very familiar with it","3","5","Visual demonstration (GIF)","Visual demonstration (GIF)","Visual demonstration (GIF)","The intensity levels were all the same ","Visual demonstration (GIF)","","22:00"

## **Appendix 15.5: ChatGPT Brainstorming conversation** **“””** **You said:**

I want you to help me brainstorm. I am specifically trying to brainstorm only on the UI display of an individual workout page for the website to display one full workout plan. taking a bit of inspiration from the version website (pictures are attached), I want you to list me concisely 20 different UI features and design choices I should consider, with a brief example. Then I want you to describe 4 design approaches I can take to design the page. The design of the page involves incorporating the key insights sometimes and also must meet the minimum criteria: showing users: the workouts in the plan, the set and the rep counts for each exercise, a video demonstration for each workout shown somewhere, enough details to aid the user in understanding the exercise to perform Describe the 4 approaches well enough that I can draw a wireframe of it as a prototype.

###### **ChatGPT said:**

Here is a structured brainstorming guide specifically tailored for designing the UI display of an individual workout page. This approach is inspired by Juan's Exercise Database (Version 0), integrates your key insights, and addresses your minimum criteria clearly:

## **UI Features and Design Choices (Concise List with Brief Examples):**

### **Exercise Identification and Progress:**

1. **Visual Progress Indicator:**  
    Example: Checkmarks or color highlights for completed exercises.

2. **Sequential Exercise Navigation:**  
    Example: “Next” and “Previous” buttons clearly guiding navigation.

3. **Exercise Cards:**  
    Example: Individual boxes for each exercise, each containing key details.

4. **Collapsible Exercise Panels:**  
    Example: Expandable sections showing/hiding extra details.

5. **Workout Progress Bar:**  
    Example: Horizontal progress bar indicating the overall workout progress.

### **Reps and Sets Display:**

6. **Distinct Typography for Reps/Sets:**  
    Example: Bold, large numbers for quick readability.

7. **Tabular Layout:**  
    Example: Reps and sets organized neatly into clear columns.

8. **Quick Adjustments Controls:**  
    Example: Buttons like “+” and “-” for quick number adjustments.

9. **Preset Rep/Set Schemes:**  
    Example: Dropdowns or shortcuts for frequently used configurations.

10. **Adaptive Reps/Sets for Difficulty:**  
     Example: Suggestions for reps/sets based on past performance or user choice.

### **Video Demonstration Integration:**

11. **Embedded GIF Previews:**  
     Example: Autoplayed, looped GIFs next to each exercise description.

12. **Toggleable Videos:**  
     Example: Small buttons to quickly expand/hide video demos to manage space.

13. **Hover-to-Play:**  
     Example: Videos or GIFs only playing on hover or tap to reduce distraction.

14. **Thumbnail Navigation:**  
     Example: Small, consistent-sized thumbnails for videos within each exercise card.

15. **Pop-Up Video Modal:**  
     Example: Clicking on exercise name or icon opens a larger pop-up video.

### **Additional Exercise Information:**

16. **Instant Tooltips for Terms:**  
     Example: Hover or click reveals short explanations of exercise terms or abbreviations.

17. **Quick Reference Icons:**  
     Example: Icons representing muscle groups or exercise categories.

18. **Concise Notes Section:**  
     Example: Brief, bullet-point tips and advice for each exercise.

19. **Difficulty Tags:**  
     Example: Simple color-coded tags (Easy, Medium, Hard).

20. **Equipment Needed Indicator:**  
     Example: Visual icons or small text clearly indicating equipment requirements.

---

## **Four UI Design Approaches for Individual Workout Page:**

### **Approach 1: Card-Based Minimalist Layout**

* **Top Bar:** Contains workout name, overall progress bar, and a minimal navigation bar.

* **Exercise Cards:** Each exercise represented as a clean, spacious card containing:

  * Exercise Name

  * Bold, large Reps/Sets display

  * Thumbnail GIF (autoplay)

  * Equipment icons

* **Interaction:** Expandable for more details, notes, and larger video demos.

* **Progress:** Cards gray out/check off visually once completed.

---

### **Approach 2: Vertical Timeline View**

* **Left Sidebar:** Persistent progress indicator and navigation menu.

* **Main Content (Vertical Timeline):**

  * Exercises stacked vertically in order of execution.

  * Clear numbered sequence, visually guiding users through the workout.

  * Each node on the timeline includes:

    * Name of the exercise

    * Reps and sets in bold

    * GIF/video demos directly below each exercise name.

* **Additional Details:** Notes, difficulty, and equipment indicators shown next to each exercise clearly.

---

### **Approach 3: Interactive Tabular Grid**

* **Header:** Workout title and quick navigation controls (Next, Previous).

* **Exercise Grid (Two-column layout):**

  * Left Column: Exercise names, brief notes, icons for equipment.

  * Right Column: Sets, reps, and small GIF thumbnail.

* **Interaction:** Clicking an exercise expands the cell horizontally to show a larger embedded video and detailed instructions, collapsible with another click.

* **Progress Management:** Checkbox completion system within each row.

---

### **Approach 4: Focus Mode with Sidebar Navigation**

* **Left Vertical Sidebar:**

  * Shows a compact list of exercises in order, with active exercise highlighted.

  * Visual indicators (checkmarks/colors) indicate progress.

* **Central Focus Pane (single exercise focus):**

  * Exercise title large at top-center.

  * Detailed visual demo (large embedded GIF or video).

  * Prominent Reps/Sets display clearly centered beneath demo.

  * Concise exercise notes and tips neatly positioned beneath the reps/sets.

* **Navigation Controls:** Bottom or side positioned clear forward/backward navigation to cycle through exercises.

---

These design approaches incorporate your key insights on clear exercise demonstrations, visual progress indicators, simplicity of information display, intuitive structure, customizable or adaptive features, and effective management of cognitive load. Each approach offers a distinct way to visually structure and interact with workout content, suitable for wireframe prototyping and further evaluation.

“””

## **Appendix 15.6: Comparative Assessment of Designs Survey**

## Survey Questions

---

**Action App Design Feedback Survey**

Thank you for participating in this survey about the Action App, a mobile application designed to enhance workout planning and execution. You'll be evaluating 3 different design prototypes for the app interface. 1\. Expandable Rows Design 2\. Simple List w/ Video Modal Design 3\. Sequential View w/ Timeline Design Goal of Interfaces: Aid users in following and sharing workout plans during workout sessions. You can view the design prototypes in detail at this link: \[https://drive.google.com/file/d/1f0PudFEJI3W2QPTCDe9oqcWdXebZGJVS/view?usp=sharing\] Please take a moment to review the 3 Design before starting the survey. This survey should take approximately 8-10 minutes to complete. Your feedback will help us create a more intuitive and useful workout experience.

![][image23]

![][image24]

![][image25]

![][image26]![][image27]

## **Appendix 15.7: Design Comparative Survey Results in CSV Format**

response,Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8,Q9,Q10,Q11,Q12,Q13,Q14,Q15,Q16,Q17,Q18,Q19

1,Yes,Commercial gym,Strength training;Cardio,3. I feel like it works well with the actual progression of a workout and how I would workout,Moderately likely,Design 1 (Expanding Row View) is better,"Again, I feel like I can more easy find the chronological ordering of the workout",Design 3 (Sequential View /w Timeline) is easier,"Again, I feel like I can more easy find the chronological ordering of the workout",Design 3 (Sequential w/ Timeline View) is better,"Again, I feel like I can more easy find the chronological ordering of the workout",Exercise completion checkmarks;Visual demonstration (images/GIFs);Exercise notes and form tips;Progress tracking;Sets and reps information;Requirements list,Share functionality;Navigation between exercises,N/A,I feel like all the features are all there. Maybe like a more clear video of the exercise.,,,,No

2,Yes,Living Space,Functional training,"1, I like the feedback I get from collapsing the row, it makes me feel like I've made progress",Very likely,Design 1 (Expanding Row View) is better,I'm not a fan of modals because it typically takes more clicks to get to navigate around,Design 3 (Sequential View /w Timeline) is easier,"I like the timeline view at the top, makes scrolling through workouts simpler",Design 1 (Expanding Row View) is better,"I think for me, its more intuitive to scroll vertically versus horizontally ",Exercise completion checkmarks;Visual demonstration (images/GIFs);Progress tracking;Sets and reps information;Requirements list;Navigation between exercises,Share functionality,"No, design is very minimal and aesthetic, its clear what are buttons and what is just text","I think in design 3, it's not clear if you have to iteratively click through each one to navigate, for example going from exercise 1 to 5, does that require clicking the ""Next"" button 4 times or i can press on the 5th toggle at the top","Bug \- unclear what the symbols represent, they seem contradicting","Modal is nice, but it's too focused of a view, can't interact with anything else. ","I like that the image is large and viewable, maybe a more explicit way of navigating through the exercises?","It'd be cool that to have set tracking, so maybe like when you finish a set, you can click on the sets and it'd decrease the number. That would help reduce the cognitive load of having to remember how many sets i have left"

3,Yes,Commercial gym,Strength training,"Design 3, looks better and provides the most information for a workout routine you will do anyways. A list is better for seeing if you want to do it, but then provides more friction clicking in and out of each exercise. ",Somewhat likely,Design 2 (List /w Modal View) is better,Seeing everything at a glance provides a much better idea of everything needed,Design 3 (Sequential View /w Timeline) is easier,Design 3 is much better for providing information needed for an individual workout,Design 3 (Sequential w/ Timeline View) is better,The view of the workout is the largest with the least friction,Visual demonstration (images/GIFs);Progress tracking;Sets and reps information,Exercise completion checkmarks;Share functionality;Requirements list;Navigation between exercises,I just hope the final product doesn't look like it was made in Windows XP\! I don't like adding RPE in apps/instructions. People never understand what it is and it's just fluff to anyone working out and may even be confusing for them.,"Gamifying it would help keep people focused. Give people ""quests"" intra set. For example, on bench, get so specific for people with a bullet list of: 1\) Grip the bar firmly. 2\) Arch your back slightly 3\) Feet planted in a 90 degree angle. etc","It's nice having almost all the information 1 click away. However, once you get into the workout page, all the information needs to be as large as possible for people with poor eyesight to see it. ","Not much works well, I like this one the least. I'm a big fan of Design 3",This is the best design. Just make sure to make it pretty\!,"Nope, good luck"

4,Yes,Home gym,Strength training;Cardio,"Design 2, I like the simplicity and how I can see a lot at once, I don't want to navigate around a lot while working out.",Somewhat likely,Design 2 (List /w Modal View) is better,I can see all of the exercises listed out,Design 2 (List w/ Modal View) is easier,I can see all of the exercises and click on the one I need,Design 3 (Sequential w/ Timeline View) is better,I can see information about the exercises in design 3,Exercise completion checkmarks;Progress tracking;Sets and reps information,Visual demonstration (images/GIFs),N/A,Maybe information on what areas of your body you're building with the workout.,I don't like how much space the drop down takes.,"I like the simple view and progress tracking, if I need a video or notes, then I can click on an exercise to view.",I like the visual representation to know how much I've done or how much is left.," It could be nice to have a ""lock"" mode so that I don't accidentally click on an option while moving my phone. "

5,Yes,Fitness studio/class setting,Strength training;Other,Expanding Row View because it lets be pick the order I would like to perform workout.,Extremely likely,Design 1 (Expanding Row View) is better,Expandable lets me see all the workouts I need to complete for the session. I like have the choice of order of operation. Also a high level view of the entire workout sequence.,Design 2 (List w/ Modal View) is easier,I don't like the entire workout to take up the whole screen on my phone. It's more clicks to get through the entire session.,Design 1 (Expanding Row View) is better,I like to be able to expand and collapse menu items,Exercise completion checkmarks;Sets and reps information;Navigation between exercises,Other,"No, I understood all features.",switching to a dark view. easier on the eyes at night.,collapsable view help me remember the exercise in case I forget my phone.,Smaller text to work with landscape more efficiently.,Full screen video,smaller titles larger video. I like to see a percentage completed. Help motivate.

6,Yes,Outdoors,Cardio,1. like the interface the most,Somewhat likely,Design 1 (Expanding Row View) is better,better interface,Design 3 (Sequential View /w Timeline) is easier,easiser to understand,Design 1 (Expanding Row View) is better,best interface,Exercise completion checkmarks;Progress tracking,Share functionality;Navigation between exercises,n/a,n/a,,,,n/a

7,Yes,Commercial gym,Strength training;Functional training,Design 2 (List w/ Modal View),Extremely likely,Design 2 (List /w Modal View) is better,Design 2 provides a better overview of the entire workout because I have so many years of experience that I would not really need to see the how to do an exercise unless it was new to me.,Design 2 (List w/ Modal View) is easier,Design 2 would be easier in my opinion as it gives the overview without seeing the image to the video.,Design 3 (Sequential w/ Timeline View) is better,Design provides a better visual demonstration if that is what you're looking for that resource as a beginner or novice at working out.,Exercise completion checkmarks;Progress tracking;Navigation between exercises,Other,All the features across the desgins were very easy to understand and use.,No missing design features.,Everything for Design 1 works well for users who need those specific features as an expandable row view. Having some color would improve the ease of viewing in my opinion.,"Everything for Design 2 works well for users who appreciate list (like me). Again, having color would improve experience.","Everything for Design 3 works well for users who appreciate guidance of a sequential timeline as presented would be appreciated. Once more, color would make the timeline more visible and make it pop.","Honestly, being able to input the weight you use for each exercise as either a slider range, number input or being able to say the amount verbally."

8,Yes,Living Space,Strength training,"Design 1, because it allows for visualization of entire workout without initially hiding the video demo.",Extremely likely,Design 1 (Expanding Row View) is better,All relevant information regarding the workout is initially available in Design 1\. Design 2 initially hides away video demos.,Design 2 (List w/ Modal View) is easier,Design 2 allows for the user to choose the order of their exercises as they workout.,Design 1 (Expanding Row View) is better,Design 1 allows for visualization of the entire workout as opposed to just one exercise at a time.,Visual demonstration (images/GIFs);Exercise notes and form tips;Progress tracking,Share functionality,No,Expected timeline and progress checks should both be implemented to encourage the user and allow them to compare their expected progress to actual progress.,"Overall workout visualization works well, a timeline of expected progress should be added.","Overall workout visualization works well, video demos should not be initially hidden.","Individual exercise visualization works well, overall workout visualization can be improved.",No

9,Yes,Living Space,Functional training;Yoga/Pilates,"Design 3\. Design 2 seems okay, but 3 has all the benefits of 1\. I like to see the progress.",Moderately likely,Design 1 (Expanding Row View) is better,"Design 1 allows you to see the entire workout (mostly) even while the video is playing. With design 2, it's only when the modal is closed. ",Design 3 (Sequential View /w Timeline) is easier,"They are both easy to use, but the modal would be annoying to click out of. ",Design 3 (Sequential w/ Timeline View) is better,The video is literally bigger.,Exercise completion checkmarks;Visual demonstration (images/GIFs);Exercise notes and form tips;Progress tracking;Sets and reps information,Share functionality,"No, the features made sense.",How do you adjust sets and reps? Are there video controls?,How do you adjust sets and reps?,"Instead of a modal (which takes up most of the screen), I would probably just make it a new page. ",How do you know how many sets you've done? Or are you focusing on avoiding that kind of detail?,The thing I need the most is workout structuring and exercise suggestions. Creative and new ways to hit the same muscles. 

10,Yes,Commercial gym,Strength training;Yoga/Pilates,"3, because it is the most visually appealing. ",Moderately likely,They are equally effective,I think they are too similar to really make a difference in overview,Design 3 (Sequential View /w Timeline) is easier,"3, although I like the cross-out of the list model view, i think 3 is most visualling appealing.",Design 3 (Sequential w/ Timeline View) is better,"Again, 3 is most visually appealing.",Exercise completion checkmarks;Visual demonstration (images/GIFs),Share functionality,None,If 3 could contract into 2 list view that would be neat. ,Hiding/opening the visual box makes it more organized and less cluttered. ,I like that there is a cross-out font that differentiates the worksout you ocmpleted from the workouts you have yet to complete. ,I think a compact view would make this already visually appeasing view more organized. ,No.

11,Yes,Home gym,Strength training;Cardio,1 because I would to see the whole workout at all times whereas other 2 occlude the view of whole workout,Moderately likely,Design 1 (Expanding Row View) is better,Modal covers the view of whole workout,Design 3 (Sequential View /w Timeline) is easier,Design 3 looks like I would have less misclicks ,They are equally effective,Both have similar features of showing the exercise,Exercise completion checkmarks;Visual demonstration (images/GIFs);Progress tracking;Sets and reps information,Other,No I understood the prototypes,Tracker for sets and reps like a notebook,I think this design has the best flow as well as not showing too much information if not needed.,I believe the modal should be placed so that it doesn't block the workout list,Good,Possibly include the actual sets and reps performed per exercise

12,Yes,Fitness studio/class setting,Strength training;Yoga/Pilates,Design one because i like the top to bottom view and the fact that there’s the video directly correlated to each expanded row ,Moderately likely,Design 1 (Expanding Row View) is better,less taps is better \- i don’t want to have to have to tap for the demo to pop up. i like it when it’s on the same screen instead of pop up,Design 3 (Sequential View /w Timeline) is easier,Focuses on one workout at a time so it doesn’t get too confusing or overwhelming ,They are equally effective,i like both\! either works \- i like the expanding rows of design 1 and the individual steps/workouts of design 3,Exercise completion checkmarks;Visual demonstration (images/GIFs);Progress tracking;Sets and reps information;Navigation between exercises,Share functionality,n/a,n/a,i like that each workout and demo have their own dedicated section and i can easily expand and close ,"i dont love pop up because it feels like very separated from the experience, and when i see pop up type formats i think of ads ","this is okay too, i like design 1 best but this one is second place.maybe include name of the  next exercise down by the button so someone will know what to expect ",no thank you :) great work\!

13,Yes,Fitness studio/class setting,Cardio,Design 1\. I can easily see all the other workouts coming up and check off what I’ve done.,Moderately likely,Design 1 (Expanding Row View) is better,You can see all the other workouts at all times,Design 3 (Sequential View /w Timeline) is easier,Less buttons to press to have a big screen of the workout,Design 3 (Sequential w/ Timeline View) is better,Bigger screen without having to expand the video,Exercise completion checkmarks;Visual demonstration (images/GIFs);Sets and reps information,Exercise notes and form tips;Share functionality,N/A,Recommended amount of time spent on each set,Lots of information visible at all times (which I like to have during a workout). Some people may feel overwhelmed or may not want to have to expand each video for each new exercise.,Some people may like not seeing what’s coming next so they can focus on the rep they’re on. The pop out hides everything else but I would rather see what’s coming up and what I’ve completed already.,"It’s easy to focus on the exercise you’re on because it has its own page and everything else is hidden. If people want to see what’s coming up, they can’t unless they leave the page they’re on.",N/A

14,Yes,Living Space,Yoga/Pilates,Design 1\. Clean interface when I’m not interested in seeing details about a workout. Details are easy to view when needed.,Somewhat likely,Design 1 (Expanding Row View) is better,Easier to expand all details of workout at once.,Design 3 (Sequential View /w Timeline) is easier,Looks like it’d be easier to use while moving.,Design 3 (Sequential w/ Timeline View) is better,Bigger image/video. Less “dead space”.,Exercise completion checkmarks;Progress tracking;Sets and reps information;Requirements list,Other,No,Recommended pace of reps.,Simple interface. Easy to expand and shrink what is needed/not needed. Maybe a bit plain.,Not a fan of pop up windows. ,Nice layout. Looks very professional. Doesn’t look like it’d be easy to get an overview of all exercises.,Cool app\!

15,Yes,Commercial gym,Cardio,good,Extremely likely,Design 1 (Expanding Row View) is better,good,Design 2 (List w/ Modal View) is easier,easy to work with,Design 1 (Expanding Row View) is better,can be helpful,Visual demonstration (images/GIFs),Exercise notes and form tips,no,no,,,,no

16,Yes,Fitness studio/class setting,Cardio;Functional training,"Design 3 was clearest for visibility and ease of following the individual workout (my personal fav for interface looks wise) but I do appreciate the list view of 2\. Design 1 layout with expandable rows was nice to be able to see all workouts in a list and mark as you go, but not the prettiest. Design 2’s workout and list display is preferred over design 1, but having the pop up video window is less user friendly since you have to click in and out of it, imo. ",Very likely,Design 2 (List /w Modal View) is better,Design 2 is more informative and clear for the workout instructions than Design 1\. ,Design 3 (Sequential View /w Timeline) is easier,"The sequence is nice where you can just follow along and hit next, no exiting out or clicking to the next workout. ",Design 3 (Sequential w/ Timeline View) is better,"Design 3 feels like it focuses more on the individual workout itself which makes it easier to follow when doing that workout, whereas 1 feels like it focuses on seeing the whole workout as a list and only looking at the expansion for assistance beyond the workout name. ",Visual demonstration (images/GIFs);Exercise notes and form tips;Sets and reps information,Share functionality,I wish the sets and reps count for Design 1 were under the video like in 2 and 3\. I had to do a double take to understand at first. ,Maybe a break time between workouts? or an optional timer to see your speed? Maybe weight suggestions based on personalized stats and the type of workout you’re doing? ,seeing the whole list of workouts is helpful. overall design look doesn’t feel as clean compared to the other two. ,seeing the whole list and having them be crossed out and shaded when completed is helpful. separate pop up window may not be as functional?,"Design is very nice and easy to follow. Seeing the whole workout or having the option to, like in Design 2 would be nice",maybe added workout descriptions under the video that you can scroll through and read to help with form and technique

17,Yes,Outdoors,Cardio;Other,3,Very likely,Design 1 (Expanding Row View) is better,I'm able to view everything without a pop up ,Design 3 (Sequential View /w Timeline) is easier,The timeline bar better visualizes the how far along I am with the workout,Design 3 (Sequential w/ Timeline View) is better,The page is bigger,Exercise completion checkmarks;Visual demonstration (images/GIFs);Progress tracking,Exercise notes and form tips,None,None,The pop down bar is good,Isolating the video is good,The timeline progress bar is good,None

18,Yes,Commercial gym,Strength training;Functional training,Design 3,Very likely,They are equally effective,I do not have a prefrence between the two ,Design 3 (Sequential View /w Timeline) is easier,Design 3 is the most user inteface friendly and allows for a organized and effective workout session. ,Design 3 (Sequential w/ Timeline View) is better,Design 3 is undoubltley the best choice allowing for proper tracking as well as motivation to complete the exrecises ,Exercise completion checkmarks;Progress tracking;Sets and reps information,Other,I find all features easily understable as well as necessary and appreciated. ,Maybe a fetaure that incoporates another varaiation of a workout if that current workout isnt feasable. another great feature would be able to switch the music the person is liseting to within the app itself. ,I think this design is trying to accomplish to many things at once and is over crowded.,"This design is to minimialastic and leaves the video to small and not the center of attention, which doesnt allow the vidoe to educate on proper form. ","I find design 3 to be absolutely perfect, and to my expectations.",A timer could also be beneficial to hold the user accountable of how much time they are spending on each exercise as well as between exercises/sets AKA rest periods. 

19,Yes,I Rarely Exercise,Strength training;Cardio;Sports-specific training,"Design 1, the checkmark with the ability to dropdown if I need reminders is ideal",Moderately likely,Design 1 (Expanding Row View) is better,Contained to a single page is preferable,Design 3 (Sequential View /w Timeline) is easier,Design 3 has a larger view of the exercises,Design 3 (Sequential w/ Timeline View) is better,Design 3 has a larger view of the exercises,Exercise completion checkmarks;Progress tracking;Requirements list,Other,Nope,Last weight used,"Same for all, keeping track of previous weight for an exercise would be ideal","Same for all, keeping track of previous weight for an exercise would be ideal","Same for all, keeping track of previous weight for an exercise would be ideal",Recommended rest between sets and workouts

20,Yes,Home gym,Strength training,Design 1\. I like to see the whole list so I can be flexible switching around exercise order,Very likely,Design 1 (Expanding Row View) is better,I can see the whole list and quickly go to a specific exercise,They are equally easy,"Design 3 would be better for at home workouts to keep you on task and in sequence, while type 2 is a bit better for commercial gym setting if you cant always follow all exercises in preset sequence",Design 3 (Sequential w/ Timeline View) is better,Video demo takes up more of the screen,Visual demonstration (images/GIFs);Progress tracking;Sets and reps information,Share functionality,None,"% rep max, weights tracking","The design looks clean, can be beginner friendly, doesnt require many taps to see demo. A function to track weights used would help","Design 2 looks clean with less redundancy compared to the other 2, but can be less engaging because users have to open each tap to see reps and video demo",Keeps users engaged but not convenient to switch around exercise order,"Record weights, record 1RM, track and recommend weights according to %RM, rest period, audio demonstration"

## **Appendix 15.8: Final Evaluation Think Aloud lead questions**

Task: 

1. Explore the page freely and talk aloud about your first impressions  
2. With the workout page, can you figure out the amount of reps you need to do for the leg curls and which way your palm should face  
3. Talk through steps of figuring out how much weight they should use for the squat jump  
4. Talk through steps of figuring out how far in the workout you are  
5. Play around with check marks and timeline and see if the interface is intuitive and easy to understand  
6. Share the exercise with one of your friends

Reflection: 

1. What was the easiest part of using the website?  
2. Were there moments you felt stuck or confused?  
3. Did the layout and navigation match your expectations? How could it be improved?  
4. Could you easily find what you needed? If not, what would make it easier  
5. Did the language and terminology used on the website feel clear and natural?  
6.  Would you return to this website in the future?  
7. Any additional feedback?