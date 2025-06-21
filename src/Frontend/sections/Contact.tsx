import React, { ComponentType } from 'react';
import { IconBaseProps } from 'react-icons';
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

interface ContactIcon {
  Icon: ComponentType<IconBaseProps>;
  text: string;
}

const Contact: React.FC = () => {
  const contactIcons: ContactIcon[] = [
    { Icon: MdEmail as ComponentType<IconBaseProps>, text: 'info@student.rmit.edu.au' },
    { Icon: MdPhone as ComponentType<IconBaseProps>, text: '+61 123 123 123' },
    { Icon: MdLocationOn as ComponentType<IconBaseProps>, text: 'Melbourne, VIC 3000' }
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>CONTACT US</h2>
          
          <div className="contact-details">
            {contactIcons.map(({ Icon, text }) => (
              <div key={text} className="contact-item">
                {React.createElement(Icon, { className: "contact-icon" })}
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-form">
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" />
            </div>
            <div className="form-group">
              <input type="text" placeholder="Subject" />
            </div>
            <div className="form-group">
              <textarea placeholder="Message" rows={6}></textarea>
            </div>
            <button type="submit" className="submit-button">Submit Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;