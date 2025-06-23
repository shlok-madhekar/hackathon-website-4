import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  organization: z.string().min(2, { message: "Organization must be at least 2 characters" }),
  about: z.string().min(10, { message: "Tell us more about yourself" }),
});

const rateLimits = new Map<string, { count: number; timestamp: number }>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Get IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const now = Date.now();
    const userRateLimit = rateLimits.get(ip) || { count: 0, timestamp: now };

    // Reset counter if more than 1 hour has passed
    if (now - userRateLimit.timestamp > 60 * 60 * 1000) {
      userRateLimit.count = 0;
      userRateLimit.timestamp = now;
    }

    if (userRateLimit.count >= 5) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    // Validate form data
    const validated = formSchema.parse(body);

    // Increment rate limit
    userRateLimit.count += 1;
    rateLimits.set(ip, userRateLimit);

    // Generate email content
    const html = `
      <h2>Thank you for registering, ${validated.name}!</h2>
      <p>We have received your registration for Grizzly Hacks 2025.</p>
      <p><b>Name:</b> ${validated.name}<br/>
      <b>Email:</b> ${validated.email}<br/>
      <b>Organization:</b> ${validated.organization}<br/>
      <b>About you:</b> ${validated.about}</p>
      <p>We look forward to seeing you at the event!</p>
    `;
    const text = `
      Thank you for registering, ${validated.name}!
      We have received your registration for Grizzly Hacks 2025.
      Name: ${validated.name}
      Email: ${validated.email}
      Organization: ${validated.organization}
      About you: ${validated.about}
      We look forward to seeing you at the event!
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Grizzly Hacks <onboarding@resend.dev>",
      to: validated.email,
      subject: "Grizzly Hacks Registration Confirmation",
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message || "Failed to send confirmation email." }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors.map(e => e.message).join(", ") }, { status: 400 });
    }
    console.error("API error:", error);
    return NextResponse.json({ error: "Failed to send confirmation email." }, { status: 500 });
  }
} 