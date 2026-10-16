import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCategory, searchKnowledgeBase, evaluateResponseQuality, getUpcomingDeadlines } from './qa-engine.ts';

test('classifyCategory correctly classifies all 4 key domains', () => {
  // Courses
  assert.equal(classifyCategory('When is the course add/drop deadline?'), 'courses');
  assert.equal(classifyCategory('What are the prerequisites for CS350 Machine Learning?'), 'courses');

  // Internships
  assert.equal(classifyCategory('How to get an NOC for summer internship?'), 'internships');
  assert.equal(classifyCategory('Are remote internships allowed for college students?'), 'internships');

  // Deadlines
  assert.equal(classifyCategory('When is the tuition fee payment deadline?'), 'deadlines');
  assert.equal(classifyCategory('What is the last date to submit the thesis project?'), 'deadlines');

  // Certificates
  assert.equal(classifyCategory('How can I apply for an official transcript?'), 'certificates');
  assert.equal(classifyCategory('I need a bonafide student certificate for my bank account'), 'certificates');
});

test('searchKnowledgeBase returns high-accuracy match for student queries', () => {
  const matchAddDrop = searchKnowledgeBase('When does course add drop close?');
  assert.ok(matchAddDrop);
  assert.equal(matchAddDrop?.id, 'faq-course-add-drop');
  assert.match(matchAddDrop?.detailedAnswer, /October 24, 2026/);

  const matchNOC = searchKnowledgeBase('How do I apply for an internship NOC?');
  assert.ok(matchNOC);
  assert.equal(matchNOC?.id, 'faq-internship-noc');
  assert.match(matchNOC?.detailedAnswer, /T&P Portal/);

  const matchBonafide = searchKnowledgeBase('I need a bonafide certificate for passport');
  assert.ok(matchBonafide);
  assert.equal(matchBonafide?.id, 'faq-cert-bonafide');
});

test('evaluateResponseQuality calculates rubric score, category matching, and keyword coverage', () => {
  const question = 'When is the last day to drop a course without penalty?';
  const goodAnswer = `The deadline for course Add/Drop is October 24, 2026 at 11:59 PM. Courses dropped by this date incur no academic penalty and will not appear on your official transcript. Refer to Academic Policy Handbook Section 4.2.`;
  
  const evalResult = evaluateResponseQuality(
    question,
    goodAnswer,
    'courses',
    ['October 24, 2026', 'Add/Drop', 'transcript', 'penalty']
  );

  assert.equal(evalResult.categoryMatch, true);
  assert.ok(evalResult.keywordMatchRate >= 75);
  assert.ok(evalResult.score >= 80);
  assert.equal(evalResult.passed, true);

  // Inadequate answer check
  const badAnswer = 'You can drop courses whenever you feel like it.';
  const badEval = evaluateResponseQuality(
    question,
    badAnswer,
    'courses',
    ['October 24, 2026', 'Add/Drop', 'transcript', 'penalty']
  );
  assert.equal(badEval.passed, false);
  assert.ok(badEval.score < 50);
});

test('getUpcomingDeadlines returns items sorted in chronological order', () => {
  const deadlines = getUpcomingDeadlines();
  assert.ok(deadlines.length >= 5);
  for (let i = 0; i < deadlines.length - 1; i++) {
    assert.ok(deadlines[i].timestamp <= deadlines[i + 1].timestamp);
  }
});
